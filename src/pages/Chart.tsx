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
import {ButtonGroup, Col, Container, Dropdown, DropdownButton, Row} from "react-bootstrap";
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
const ALL_YEARS = "All Years";
const LAST_30_DAYS = "Last 30 Days";

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
    const [yearFilter, setYearFilter] = useState(LAST_30_DAYS);
    const [weightChartData, setWeightChartData] = useState([]);
    const allLabels: string[] = sortDates(weightEntries.map((we: WeightEntry) => we.dt));
    const [weightChartLabels, setWeightChartLabels] = useState([]);
    const [statsForPeriod, setStatsForPeriod] = useState({
        maxWeight: 0,
        minWeight: 0,
        weightLost: 0,
        weightGained: 0,
        weightLostFromMaxToMin: 0,
        weightGainedFromMinToMax: 0
    });
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
        handleYear(yearFilter);
    }, [weightEntries, yearFilter]);

    const handleYear = (year: string) => {
        if (year === ALL_YEARS) {
            setYearFilter(ALL_YEARS);
            setWeightChartData(weightEntries.map(we => we.lbs));
            setWeightChartLabels(allLabels);
        } else if (year === LAST_30_DAYS) {
            setYearFilter(LAST_30_DAYS);
            const filteredWeightEntries = weightEntries.filter(we => {
                const weightEntryDt = DateUtils.parseDate(we.dt);
                const thirtyDaysAgo = DateUtils.subtractDays(new Date(), 30);
                return DateUtils.equals(weightEntryDt, thirtyDaysAgo) || DateUtils.isAfter(weightEntryDt, thirtyDaysAgo);
            });
            setWeightChartData(filteredWeightEntries.map(we => we.lbs));
            setWeightChartLabels(sortDates(filteredWeightEntries.map((we: WeightEntry) => we.dt)));
        } else {
            // this is a real numeric year
            setYearFilter(year);
            const filteredWeightEntries = weightEntries.filter(we => getYear(we) === parseInt(year));
            setWeightChartData(filteredWeightEntries.map(we => we.lbs));
            setWeightChartLabels(sortDates(filteredWeightEntries.map((we: WeightEntry) => we.dt)));
        }
    };

    if (busy.state) {
        return <SpinnerTimer key="loading-weight-entries" message={busy.message} />;
    } else {
        return (
            <Container>
                <Row className="mt-2">
                    <div className="me-2 col">
                        <DropdownButton
                            as={ButtonGroup}
                            variant="primary"
                            title={yearFilter}
                            onSelect={handleYear}
                        >
                            <Dropdown.Item key={ALL_YEARS} eventKey={ALL_YEARS}>{ALL_YEARS}</Dropdown.Item>
                            <Dropdown.Item key={LAST_30_DAYS} eventKey={LAST_30_DAYS}>{LAST_30_DAYS}</Dropdown.Item>
                            {uniqueYears.length > 0 && uniqueYears.map(y => <Dropdown.Item key={y} eventKey={y}>{y}</Dropdown.Item>)}
                        </DropdownButton>
                    </div>
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