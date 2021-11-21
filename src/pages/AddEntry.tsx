import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {stateActions} from "../store/index";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useHistory, useLocation} from "react-router-dom";
import {DateUtils} from "../helpers/date.utils";
import weightService from "../services/WeightService";
import SpinnerTimer from "../components/spinner/SpinnerTimer";
import {WeightEntry} from "../models/weight-entry";

const AddEntry = () => {
    const dispatcher = useDispatch();
    let history = useHistory();
    const [state, setState] = useState({dt: DateUtils.formatDate(new Date()), lbs: 200, notes: ""});
    const [dateForUI, setDateForUI] = useState(new Date());
    const [saving, setSaving] = useState(false);
    let location = useLocation();
    useEffect(() => {
        if (location.state && location.state.hasOwnProperty("dt")) {
            // caller is passing in a weight entry to edit...
            setState(location.state as WeightEntry);
            setDateForUI(DateUtils.parseDate(state.dt));
        }
    }, [state, location]);

    const handleDate = (date: Date) => {
        setDateForUI(date);
        setState(prevState => {
            return {...prevState, dt: DateUtils.formatDate(date)};
        });
    }

    const handleWeight = (event: any) => {
        setState(prevState => {
            return {...prevState, lbs: parseFloat(event.target.value)};
        });
    }

    const handleNotes = (event: any) => {
        setState(prevState => {
            return {...prevState, notes: event.target.value};
        });
    }

    const handleAddEntry = async () => {
        setSaving(true);
        console.log("AddEntry.handleAddEntry - calling weightService.addEntry(state)...");
        const addEntryResult: any = await weightService.addEntry(state);
        console.log("AddEntry.handleAddEntry - here is the response:");
        console.log(addEntryResult);
        dispatcher(stateActions.addWeightEntry(state));
        setSaving(false);
        history.push("/allEntries");
    }

    return (
        <Container className="mt-3">
            {saving && <SpinnerTimer message="Saving new entry..." />}
            <h3 className="mb-3">Add New Weight Entry</h3>
            <Row className="mb-2">
                <Col lg="4">
                    <DatePicker selected={dateForUI} onChange={handleDate} />
                </Col>
            </Row>
            <Row className="mb-2">
                <Col className="me-0"><Form.Control type="number" value={state.lbs} placeholder="Enter Weight" onChange={handleWeight}/></Col>
                <Col className="my-auto"><Form.Text>lbs</Form.Text></Col>
            </Row>
            <Row className="mb-2">
                <Col lg="4"><textarea className="form-control" value={state.notes} onChange={handleNotes}/></Col>
            </Row>
            <Row className="mb-2">
                <Col>
                    <Button className="btn btn-primary" onClick={handleAddEntry}>Add Entry</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default AddEntry;