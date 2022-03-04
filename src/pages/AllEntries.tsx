// noinspection CheckTagEmptyBody

import {useDispatch, useSelector} from "react-redux";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {AgGridColumn, AgGridReact} from "ag-grid-react";
import {Container} from "react-bootstrap";
import {DateUtils} from "../helpers/date.utils";
import {WeightEntry} from "../models/weight-entry";
import {useEffect, useState} from "react";
import weightService from "../services/WeightService";
import SpinnerTimer from "../components/spinner/SpinnerTimer";
import {stateActions} from "../store";
import {ButtonCellRenderer} from "../renderers/button.cell.renderer";
import { useNavigate } from 'react-router-dom';

const AllEntries = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const weightEntries: WeightEntry[] = useSelector((st: any) => st.weightEntries);
    const [busy, setBusy] = useState({state: false, message: ""});
    const [gridApi, setGridApi] = useState(null);
    useEffect(() => {
        const callServer = async () => {
            setBusy({state: true, message: "Loading weight entries from DB..."});
            const locWeightEntriesData: any = await weightService.getEntries();
            dispatch(stateActions.setWeightEntries(locWeightEntriesData.data));
            setBusy({state: false, message: ""});
        };
        callServer();
    }, [dispatch]);


    const loadEntry = (data: WeightEntry) => {
        navigate("/addEntry", {state: data});
    }

    const handleQuickFilter = event => {
        gridApi.setQuickFilter(event.target.value);
    }

    const onGridReady = params => {
        setGridApi(params.api);
    };

    if (busy.state) {
        return <SpinnerTimer key="loading-weight-entries" message={busy.message} />;
    } else {
        if (!weightEntries || weightEntries.length === 0) {
            return <h1>No Weight Entries Found - Use Add Entry!</h1>;
        } else {
            const locWeightEntries = [...weightEntries];
            locWeightEntries.sort((a: WeightEntry, b: WeightEntry) => {
                const dt1 = DateUtils.parseDate(a.dt);
                const dt2 = DateUtils.parseDate(b.dt);
                if (DateUtils.isBefore(dt1, dt2)) {
                    return 1;
                } else if (DateUtils.isAfter(dt1, dt2)) {
                    return -1;
                }
                return 0;
            });
            const buttonCellRendererParams = {
                showUnderline: true,
                onClick: params => {
                    loadEntry(params.data);
                }
            };
            return (
                <Container className="ag-theme-alpine" style={{height: 400, width: "100%"}}>
                    <input
                        type="text"
                        placeholder="Quick Filter"
                        onChange={handleQuickFilter}
                    />
                    <AgGridReact
                        onGridReady={onGridReady}
                        rowData={locWeightEntries}
                        pagination={true}
                        paginationPageSize={5}>
                        <AgGridColumn
                            cellRenderer={ButtonCellRenderer}
                            cellRendererParams={buttonCellRendererParams}
                            headerName="Date"
                            headerTooltip="Date"
                            cellStyle={{cursor: "pointer"}}
                            width={120}
                            field="dt">
                        </AgGridColumn>

                        <AgGridColumn headerName="LBS" field="lbs" width={70}/>
                        <AgGridColumn
                            headerName="Notes"
                            valueFormatter={params => params.node.data && params.node.data.notes ? params.node.data.notes : ""}
                            cellRenderer={params => params.valueFormatted}
                            field="notes"
                            width={500}
                            wrapText={true}
                            autoHeight={true}>

                        </AgGridColumn>
                    </AgGridReact>
                </Container>
            );
        }
    }
};

export default AllEntries;