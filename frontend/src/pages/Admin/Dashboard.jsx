import React, { useContext, useEffect, useState } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth'
import { UserContext } from '../../context/userContext'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATH } from '../../utils/apiPath'
import moment from 'moment'
import InfoCard from '../../components/Cards/InfoCard'
import { addThousandsSeparator } from '../../utils/helper'
import { LuArrowRight } from 'react-icons/lu'
import ActionListTable from '../../components/ActionListTable'
import CustomPieChart from '../../components/Charts/CustomPieChart'
import CustomBarChart from '../../components/Charts/CustomBarChart'

const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"]
const Dashboard = () => {
  useUserAuth()

  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  const prepareChartData = (data) =>{
    const actionDistribution = data?.actionDistribution || null;
    const actionPriorityLevels = data?.actionPriorityLevels || null;
    
    const actionDistributionData = [
      {status: "Pending", count: actionDistribution?.Pending || 0},
      {status: "In Progress", count: actionDistribution?.InProgress || 0},
      {status: "Completed", count: actionDistribution?.Completed || 0},
    ];

    setPieChartData(actionDistributionData)

    const priorityLevelData = [
      {priority: "High", count: actionPriorityLevels?.High || 0},
      {priority: "Medium", count: actionPriorityLevels?.Medium || 0},
      {priority: "Low", count: actionPriorityLevels?.Low || 0},
    ];

    setBarChartData(priorityLevelData)
  }

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATH.ACTIONS.GET_DASHBOARD_DATA
      );
      if (response.data) {
        setDashboardData(response.data)
        prepareChartData(response.data.charts || null)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }

  useEffect(() => {
    getDashboardData();

    return () => { };
  }, []);

  const onSeeMore = () => {
    navigate('/admin/actions')
  }


  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5">
        <div>
          <div className="col-span-3">
            <h2 className="text-xl md:text-2xl">Welcome! {user?.name}</h2>
            <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
              {moment().format("dddd Do MMM YYYY")}
            </p>
          </div>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5'>
          <InfoCard
            label="Total Actions"
            value={addThousandsSeparator(
              dashboardData?.charts?.actionDistribution?.All || 0
            )}
            color="bg-primary"
          />
          <InfoCard
            label="Completed Actions"
            value={addThousandsSeparator(
              dashboardData?.charts?.actionDistribution?.Completed || 0
            )}
            color="bg-green-500"
          />
          <InfoCard
            label="In Progress Actions"
            value={addThousandsSeparator(
              dashboardData?.charts?.actionDistribution?.InProgress || 0
            )}
            color="bg-blue-700"
          />
          <InfoCard
            label="Pending Actions"
            value={addThousandsSeparator(
              dashboardData?.charts?.actionDistribution?.Pending || 0
            )}
            color="bg-red-600"
          />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6'>
        
        <div>
          <div className="card">
            <div className='flex items-center justify-between'>
              <h5 className="font-medium">Action Distribution</h5>
            </div>

            <CustomPieChart 
              data={pieChartData}
              colors = {COLORS}
            />

          </div>
        </div>

        <div>
          <div className="card">
            <div className='flex items-center justify-between'>
              <h5 className="font-medium">Action Priority Levels</h5>
            </div>

            <CustomBarChart 
              data={barChartData}
            />

          </div>
        </div>

        <div className='md:col-span-2'>
          <div className='card'>
            <div className="flex items-center justify-between">
              <h5 className='text-lg'>Recent Actions</h5>

              <button className='card-btn' onClick={onSeeMore}>
                See All <LuArrowRight className='text-base' />
              </button>
            </div>

            <ActionListTable tableData={dashboardData?.recentActions || []} />
          </div>
        </div>
      </div>
    </DashboardLayout >
  )
}

export default Dashboard