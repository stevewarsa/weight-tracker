// noinspection CheckTagEmptyBody

import {useSelector} from "react-redux";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import {AgGridColumn, AgGridReact} from "ag-grid-react";
import {Container} from "react-bootstrap";
import {DateUtils} from "../helpers/date.utils";
import {WeightEntry} from "../models/weight-entry";

const AllEntries = () => {
    const weightEntries: WeightEntry[] = useSelector((st: any) => st.weightEntries);
    if (!weightEntries || weightEntries.length === 0) {
        return <h1>No Weight Entries Found - Use Add Entry!</h1>;
    } else {
        const locWeightEntries = [...weightEntries];
        locWeightEntries.sort((a: WeightEntry, b: WeightEntry) => {
            const dt1 = DateUtils.parseDate(a.dt);
            const dt2 = DateUtils.parseDate(b.dt);
            if (DateUtils.isBefore(dt1, dt2)) {
                return -1;
            } else if (DateUtils.isAfter(dt1, dt2)) {
                return 1;
            }
            return 0;
        });
        return (
            <Container className="ag-theme-alpine mt-5" style={{height: 400, width: "100%"}}>
                <AgGridReact
                    rowData={locWeightEntries}>
                    <AgGridColumn
                        headerName="Date"
                        headerTooltip="Date"
                        width={110}
                        field="dt">
                    </AgGridColumn>

                    <AgGridColumn headerName="LBS" field="lbs" width={75}/>
                    <AgGridColumn
                        headerName="Notes"
                        valueFormatter={params => params.node.data && params.node.data.notes ? params.node.data.notes : ""}
                        cellRenderer={params => "<span title='" + params.valueFormatted + "'>" + params.valueFormatted + "</span>"}
                        field="notes"
                        width={200}></AgGridColumn>
                </AgGridReact>
            </Container>
        );
    }
};

export default AllEntries;