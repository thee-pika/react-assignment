import axios from 'axios';
import { ChevronDown } from 'lucide-react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Paginator } from 'primereact/paginator';
import { useEffect, useRef, useState } from 'react';

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { OverlayPanel } from 'primereact/overlaypanel';

interface Data {
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscriptions: string;
    date_start: string;
    date_end: string;
}
const UserTable = () => {
    const [pageNo, setPageNo] = useState(1);
    const [data, setData] = useState<Data[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [rowClick,] = useState(false);
    const [selectedRows, setSelectedRows] = useState<Data[]>([]);
    const [rowsSelected, setRowsSelected] = useState(0);
    const [allData, setAllData] = useState<Data[]>([]);

    const op = useRef<OverlayPanel>(null);
    const fetchData = async () => {
        try {
            setLoading(true);

            const res = await axios.get(`${import.meta.env.VITE_API_URL}?page=${pageNo}`);
            const newData = res.data.data;
            setData(newData);
            setTotalPages(res.data.pagination.total);
            console.log("totalPages", totalPages);

            setAllData(prev => {
                const unique = [...prev, ...newData].filter((value, index, self) =>
                    index === self.findIndex(v => v.title === value.title)
                );
                return unique;
            });

        } catch (error) {
            console.log("error", error);
        } finally {
            setLoading(false);
            console.log("finally");
        }
    }

    useEffect(() => {
        fetchData();
    }, [pageNo]);

    const onPageChange = (event: any) => {
        console.log("event", event);
        setPageNo(event.page + 1);
    }

    if (loading) {
        return <div>Loading...</div>
    }


    const handleSubmit = async () => {
        let total = rowsSelected;

        let currentPage = pageNo;
        while (allData.length < total && currentPage * 12 < totalPages) {
            currentPage++;
            const res = await axios.get(`${import.meta.env.VITE_API_URL}?page=${currentPage}`);
            const newData = res.data.data;
            setAllData(prev => [...prev, ...newData]);
        }


        const selected = allData.slice(0, total);
        setSelectedRows(selected);
        op.current?.hide();
    }

    return (
        <>
            <DataTable value={data} selectionMode={rowClick ? null : "checkbox"} selection={selectedRows}
                onSelectionChange={(e: any) => setSelectedRows(e.value)} tableStyle={{ minWidth: '50rem' }}>
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                <Column
                    field="title"
                    header={
                        <div className="card flex justify-content-center ">
                            <ChevronDown size={16} onClick={(e) => op?.current?.toggle(e)} /> Title
                            <OverlayPanel ref={op}>
                                <div>
                                    <InputText keyfilter="int" placeholder="Select Rows" onChange={(e) => setRowsSelected(parseInt(e.target.value))} />
                                    <br />
                                    <br />
                                    <Button label="Submit" onClick={handleSubmit} />
                                </div>
                            </OverlayPanel>
                        </div>
                    }
                />

                <Column field="place_of_origin" header="Place of Origin" />
                <Column field="artist_display" header="Artist Display" />
                <Column field="inscriptions" header="Inscriptions" />
                <Column field="date_start" header="Date Start" />
                <Column field="date_end" header="Date End" />

            </DataTable>


            <Paginator first={(pageNo - 1) * 12} rows={12} totalRecords={totalPages} rowsPerPageOptions={[12]} onPageChange={onPageChange} />
        </>
    )
}

export default UserTable;
