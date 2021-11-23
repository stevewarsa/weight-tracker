import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {useEffect, useRef, useState} from "react";
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
    const notesRef = useRef<HTMLTextAreaElement>();
    let history = useHistory();
    const [weightEntry, setWeightEntry] = useState({dt: DateUtils.formatDate(new Date()), lbs: 200, notes: ""});
    const [dateForUI, setDateForUI] = useState(new Date());
    const [isUpdate, setIsUpdate] = useState(false);
    const [saving, setSaving] = useState(false);
    let location = useLocation();
    // The empty dependency array in this effect is intentional.  If I put weightEntry in there, I will never be able
    // to change the state in other places - it will always revert back to what was passed in on the location
    useEffect(() => {
        if (location.state && location.state.hasOwnProperty("dt")) {
            // caller is passing in a weight entry to edit...
            setWeightEntry(location.state as WeightEntry);
            setDateForUI(DateUtils.parseDate(weightEntry.dt));
            setIsUpdate(true);
        }
    }, []);

    const handleDate = (date: Date) => {
        setDateForUI(date);
        setWeightEntry(prevState => {
            return {...prevState, dt: DateUtils.formatDate(date)};
        });
    }

    const handleWeight = (event: any) => {
        setWeightEntry(prevState => {
            return {...prevState, lbs: parseFloat(event.target.value)};
        });
    }

    const handleAddEntry = async () => {
        setSaving(true);
        console.log("AddEntry.handleAddEntry - calling weightService.addEntry(weightEntry)...  Current value of weightEntry is:");
        console.log(weightEntry);
        const addEntryResult: any = await weightService.addEntry(weightEntry);
        console.log("AddEntry.handleAddEntry - here is the response:");
        console.log(addEntryResult);
        dispatcher(stateActions.addWeightEntry(weightEntry));
        setSaving(false);
        history.push("/allEntries");
    }

    const handleOnBlur = (event) => {
        setWeightEntry(prevState => {
            const newState = {...prevState, notes: event.target.value};
            console.log("AddEntry.handleOnBlur.setWeightEntry - Setting weightEntry to newState: ");
            console.log(newState);
            return newState;
        });
        if (notesRef !== undefined && notesRef.current) {
            console.log("AddEntry.handleOnBlur - setting notesRef.current.textContent to:");
            console.log(event.target.value);
            notesRef.current.textContent = event.target.value;
        }
    };

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
                <Col className="me-0"><Form.Control type="number" value={weightEntry.lbs} placeholder="Enter Weight" onChange={handleWeight}/></Col>
                <Col className="my-auto"><Form.Text>lbs</Form.Text></Col>
            </Row>
            <Row className="mb-2">
                <Col lg="4"><textarea ref={notesRef} onBlur={handleOnBlur} className="form-control" defaultValue={weightEntry.notes}/></Col>
            </Row>
            <Row className="mb-2">
                <Col>
                    <Button className="btn btn-primary" onClick={handleAddEntry}>{isUpdate ? "Update Entry" : "Add Entry"}</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default AddEntry;