import { useState,useEffect} from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosClient from "../../axios-client";
import { handleError, handleSuccess } from "../../utils/globalFunctions";
import { ToastContainer } from "react-toastify";
import PdfViewer from "../../components/PdfViewer";

const PolicyFeedback = () => {
  const [loading,setLoading] = useState(false);
  const [docs,setDocs] = useState([]);
    const [formIsOpen, setFormIsOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitCount, setSubmitCount] = useState(0);
    const handleCreateNewPoll = () => {
        setFormIsOpen(!formIsOpen);
    };
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        pdf: null,
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleFileChange = (e) => {
        setFormData({ ...formData, pdf: e.target.files[0] });
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const headers = {
                "Content-Type": "multipart/form-data",
                "Access-Control-Allow-Origin": import.meta.env
                    .VITE_API_BASE_URL,
                "Access-Control-Request-Headers": "Content-Type, Authorization",
            };
            try {
                const response = await axiosClient.get("/all_docs");
                setLoading(false);
                const allDocs = response.data.data;
                setDocs(allDocs);
            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        };
        fetchData();
    }, [submitCount]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const {title,description,pdf} = formData;
        const uploadData = {
          title : title,
          description : description,
          pdf : pdf
        }
        console.log(uploadData)
        const headers = {
            "Content-Type": "multipart/form-data",

        };
        if (!submitting) {
            setSubmitting(true);
            try {
                const response = await axiosClient.post(
                    "/document",
                    uploadData,
                    {
                       headers
                    }
                );
                // console.log(response.data.message);
                handleSuccess("Document uploaded successfully and is live now");
                setFormData({
                    title: "",
                    description: "",
                    pdf: null,
                });
                setSubmitCount(submitCount + 1);
            } catch (error) {
                handleError(error.response.data.errors);
                console.log(error.response.data.errors);
            } finally {
                setSubmitting(false);
            }
        }
    };
    //framer_moiton
    const sectionVariants = {
        initial: {
            x: "200%",
            opacity: 0,
        },
        animate: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 0.3,
            },
        },
        exit: {
            x: "200%",
            opacity: 0,
        },
    };
    return (
        <div>
            <h1>PolicyFeedback</h1>
            <p>
                Upload new plans and policies document to get feedback from
                general public
            </p>
            <button
                className="create_new_poll_btn"
                onClick={handleCreateNewPoll}
            >
                Upload new document
            </button>
            <AnimatePresence>
                {formIsOpen && (
                    <motion.div
                        className="poll_form_container"
                        variants={sectionVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <h3>Add a new document</h3>
                        <form
                            onSubmit={handleSubmit}
                            encType="multipart/form-data"
                        >
                            <div>
                                <label>Enter the Title of the Document</label>
                                <br />
                                <input
                                    type="text"
                                    required
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="title"
                                />
                            </div>
                            <div>
                                <label>Enter the Description</label>
                                <br />
                                <input
                                    type="text"
                                    required
                                    value={formData.description}
                                    name="description"
                                    onChange={handleInputChange}
                                    placeholder="document description"
                                />
                            </div>
                            <div>
                                <label>Choose a file(pdf)</label>
                                <br />
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <button className="poll_submit_btn">
                                Upload the document
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
            {
              docs.map((value)=>(
                <div>
                  <h1>{value.title}</h1>
                  <p>{value.description}</p>
                  <PdfViewer url={value.file_path}/>
                </div>
              ))
            }
            <ToastContainer />
        </div>
    );
};
export default PolicyFeedback;
