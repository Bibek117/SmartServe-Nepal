import { useStateContext } from "../../context/ContextProvider"
import { useEffect,useState } from "react"
import { ToastContainer } from "react-toastify";
import { handleSuccess } from "../../utils/globalFunctions";
import axiosClient from "../../axios-client";
import PreLoader from "../../components/Preloader";
import '../../styles/admindashboard.css'
const Dashboard = () => {
  const { user, toastMessage,settingToastMessage} = useStateContext();
  const [loading,setLoading] = useState(false);
  const [pollStats, setPollStats] = useState({});
  useEffect(() => {
    if(toastMessage !== null){
      handleSuccess(toastMessage);
      settingToastMessage(localStorage.removeItem("toastMessage"));
    }

    const fetchData = async () =>{
      setLoading(true);
      try{
            const response  = await axiosClient.get('/admindashboard');
            setPollStats(response.data);
            setLoading(false);
      }
      catch (error) {
          setLoading(false);
          console.log(error)
      }

    }
    fetchData();
  }, [])

  return (
      <div>
          <ToastContainer />
          <h1>Summmary</h1>
          {loading && <PreLoader text="fetching data from server" />}
          {!loading && (
              <>
                  <div className="poll-stats-container">
                      <div className="poll-stat-box">
                          <h2>Total Active Polls</h2>
                          <p>{pollStats.totalActivePolls}</p>
                      </div>
                      <div className="poll-stat-box">
                          <h2>Total Inactive Polls</h2>
                          <p>{pollStats.totalInactivePolls}</p>
                      </div>
                      <div className="poll-stat-box">
                          <h2>Total Polls</h2>
                          <p>{pollStats.totalPolls}</p>
                      </div>
                      <div className="poll-stat-box">
                          <h2>Total Users</h2>
                          <p>{pollStats.totalUsers}</p>
                      </div>
                  </div>
              </>
          )}
      </div>
  );
}
export default Dashboard