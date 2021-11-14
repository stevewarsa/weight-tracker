import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {stateActions} from "../store/index";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useHistory} from "react-router-dom";
import {DateUtils} from "../helpers/date.utils";

const AddEntry = () => {
    const dispatcher = useDispatch();
    let history = useHistory();
    const [state, setState] = useState({dt: DateUtils.formatDate(new Date()), lbs: 200, notes: ""});
    const [dateForUI, setDateForUI] = useState(new Date());

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

    const handleAddEntry = () => {
        dispatcher(stateActions.addWeightEntry(state));
        history.push("/allEntries");
    }

    return (
        <Container className="mt-3">
            <h3 className="mb-3">Add New Weight Entry</h3>
            <Row className="mb-2">
                <Col lg="4">
                    <DatePicker selected={dateForUI} onChange={handleDate} />
                </Col>
            </Row>
            <Row className="mb-2">
                <Col lg="4" className="me-0"><Form.Control type="number" value={state.lbs} placeholder="Enter Weight" onChange={handleWeight}/></Col>
                <Col><Form.Text>lbs</Form.Text></Col>
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