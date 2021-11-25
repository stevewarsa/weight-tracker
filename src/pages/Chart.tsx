// noinspection RequiredAttributes

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {Line} from 'react-chartjs-2';
import {WeightEntry} from "../models/weight-entry";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {DateUtils} from "../helpers/date.utils";
import {Button, ButtonGroup, Col, Container, Dropdown, DropdownButton, Row} from "react-bootstrap";
import weightService from "../services/WeightService";
import {stateActions} from "../store";
import SpinnerTimer from "../components/spinner/SpinnerTimer";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Weight By Date',
        },
    },
};

const getYear = (weightEntry: WeightEntry) => DateUtils.parseDate(weightEntry.dt).getFullYear();
const sortWeightEntries = (weightEntries: WeightEntry[]) => {
    if (!weightEntries || weightEntries.length === 0) {
        return weightEntries;
    } else {
        return weightEntries.sort((w1, w2) => {
            if (DateUtils.equals(w1.dt, w2.dt)) {
                return 0;
            } else if (DateUtils.isBefore(w1.dt, w2.dt)) {
                return -1;
            } else {
                return 1;
            }
        });
    }
};
const sortDates = (dates: string[]) => {
    return dates.sort((dt1, dt2) => {
        if (DateUtils.equals(dt1, dt2)) {
            return 0;
        } else if (DateUtils.isBefore(dt1, dt2)) {
            return -1;
        } else {
            return 1;
        }
    });
};

const Chart = () => {
    const dispatch = useDispatch();
    const weightEntries: WeightEntry[] = useSelector((st: any) => st.weightEntries);
    const [yearFilter, setYearFilter] = useState("All Years");
    const [weightChartData, setWeightChartData] = useState([]);
    const allLabels: string[] = sortDates(weightEntries.map((we: WeightEntry) => we.dt));
    const [weightChartLabels, setWeightChartLabels] = useState([]);
    const [busy, setBusy] = useState({state: false, message: ""});
    const uniqueYears: number[] = [];
    weightEntries.map(w => getYear(w)).forEach(y => !uniqueYears.includes(y) ? uniqueYears.push(y) : () => {});
    let data = {
        labels: weightChartLabels,
        datasets: [
            {
                label: 'Pounds',
                data: weightChartData,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ]
    };
    useEffect(() => {
        if (!weightEntries || weightEntries.length === 0) {
            const callServer = async () => {
                setBusy({state: true, message: "Loading weight entries from DB..."});
                const locWeightEntriesData: any = await weightService.getEntries();
                dispatch(stateActions.setWeightEntries(sortWeightEntries(locWeightEntriesData.data)));
                setBusy({state: false, message: ""});
            };
            callServer();
        }

        setWeightChartData(weightEntries.map(we => we.lbs));
        setWeightChartLabels(allLabels);
    }, [weightEntries]);

    const handleYear = (year) => {
        setYearFilter(year);
        const filteredWeightEntries = weightEntries.filter(we => getYear(we) === parseInt(year));
        setWeightChartData(filteredWeightEntries.map(we => we.lbs));
        setWeightChartLabels(sortDates(filteredWeightEntries.map((we: WeightEntry) => we.dt)));
    };

    const handleAll = () => {
        setYearFilter("All Years");
        setWeightChartData(weightEntries.map(we => we.lbs));
        setWeightChartLabels(allLabels);
    };

    if (busy.state) {
        return <SpinnerTimer key="loading-weight-entries" message={busy.message} />;
    } else {
        return (
            <Container>
                <Row className="mt-2">
                    <Col lg="1" className="me-2">
                        <DropdownButton
                            as={ButtonGroup}
                            variant="primary"
                            title={yearFilter}
                            onSelect={handleYear}
                        >
                            {uniqueYears.length > 0 && uniqueYears.map(y => <Dropdown.Item key={y}
                                                                                           eventKey={y}>{y}</Dropdown.Item>)}
                        </DropdownButton>
                    </Col>
                    {"All Years" !== yearFilter && <Col lg="2"><Button onClick={handleAll}>All Years</Button></Col>}
                </Row>
                <Row>
                    <Col>
                        <Line options={options} data={data}/>
                    </Col>
                </Row>
            </Container>
        );
    }
};

export default Chart;