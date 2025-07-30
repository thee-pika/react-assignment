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
    id: number;
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscriptions: string;
    date_start: string;
    date_end: string;
}

const PAGE_SIZE = 12;

const UserTable = () => {
    const [pageNo, setPageNo] = useState(1);
    const [data, setData] = useState<Data[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [rowsSelected, setRowsSelected] = useState(0);
    const [selectedRowsMap, setSelectedRowsMap] = useState<Map<number, Data>>(new Map());

    const op = useRef<OverlayPanel>(null);

    const fetchData = async () => {
        try {
            setLoading(true);

            const res = await axios.get(`${import.meta.env.VITE_API_URL}?page=${pageNo}`);
            const newData = res.data.data;
            setData(newData);
            setTotalRecords(res.data.pagination.total);

        } catch (error) {
            console.log("error", error);
        } finally {
            setLoading(false);

        }
    }

    useEffect(() => {
        fetchData();
    }, [pageNo]);

    const onPageChange = (event: any) => {
        setPageNo(event.page + 1);
    }

    const handleSubmit = async () => {
        const total = rowsSelected;
        const tempMap = new Map<number, Data>();
        let page = 1;
        let fetched = 0;

        while (fetched < total) {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}?page=${page}`);
            const pageData: Data[] = res.data.data;

            for (let i = 0; i < pageData.length && fetched < total; i++) {
                const row = pageData[i];
                tempMap.set(row.id, row);
                fetched++;
            }

            if (pageData.length === 0) break; 
            page++;
        }

        setSelectedRowsMap(tempMap);
        op.current?.hide();
    };

    const onSelectionChange = (e: any) => {
        const updatedMap = new Map(selectedRowsMap);

        data.forEach((row) => {
            if (e.value.some((selected: Data) => selected.id === row.id)) {
                updatedMap.set(row.id, row);
            } else {
                updatedMap.delete(row.id);
            }
        })
        setSelectedRowsMap(updatedMap);
    }

    const getCurrentPageSelections = () =>
        data.filter((row) => selectedRowsMap.has(row.id));

    return (
        <>
            <DataTable
                value={data}
                loading={loading}
                selection={getCurrentPageSelections()}
                onSelectionChange={onSelectionChange}
                selectionMode="checkbox"
                dataKey="id"
                tableStyle={{ minWidth: "50rem" }}
            >
                <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
                <Column
                    field="title"
                    header={
                        <div className="flex items-center gap-2">
                            <ChevronDown size={16} onClick={(e) => op.current?.toggle(e)} />
                            <span>Title</span>
                            <OverlayPanel ref={op}>
                                <div className="flex flex-col gap-2 p-2">
                                    <InputText
                                        keyfilter="int"
                                        placeholder="Select Rows"
                                        onChange={(e) => setRowsSelected(parseInt(e.target.value))}
                                    />
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

            <Paginator
                first={(pageNo - 1) * PAGE_SIZE}
                rows={PAGE_SIZE}
                totalRecords={totalRecords}
                rowsPerPageOptions={[PAGE_SIZE]}
                onPageChange={onPageChange}
            />
        </>
    )
}

export default UserTable;