import React, { useEffect, useState } from 'react'
import DashboardLayout from './../../components/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apiPath';
import { LuFileSpreadsheet } from 'react-icons/lu';
import ActionStatusTabs from '../../components/ActionStatusTabs';
import TaskCard from '../../components/Cards/TaskCard';

const MyActions = () => {
  const [allActions, setAllActions] = useState([])

  const [tabs, setTabs] = useState([])
  const [filterStatus, setFilterStatus] = useState("All")

  const navigate = useNavigate()

  const getAllActions = async () => {

    try {
      const response = await axiosInstance.get(API_PATH.ACTIONS.GET_ALL_ACTIONS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      })

      setAllActions(response.data?.actions?.length > 0 ? response.data.actions : [])

      // map status summary
      const statusSummary = response.data?.statusSummary || {}

      const statusArray = [
        { label: "All", count: statusSummary.allActions || 0 },
        { label: "Pending", count: statusSummary.pendingActions || 0 },
        { label: "In Progress", count: statusSummary.inProgressActions || 0 },
        { label: "Completed", count: statusSummary.completedActions || 0 },
      ]

      setTabs(statusArray)
    } catch (error) {
      console.error("Error fetching all actions:", error)
    }
  }

  const handleClick = (actionId) => {
    navigate(`/user/action-details/${actionId}`)
  }

  useEffect(() => {
    getAllActions();
    return () => { }
  }, [filterStatus])
  return (
    <DashboardLayout activeMenu="My Actions">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <h2 className="text-xl md:text-2xl font-medium">My Actions</h2>

          {tabs?.[0]?.count >= 0 && (
              <ActionStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
          )}

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 ">
          {allActions?.map((item, index) => (
            <TaskCard
              key={item._id}
              title={item.title}
              description={item.description}
              priority={item.priority}
              status={item.status}
              progress={item.progress}
              createdAt={item.createdAt}
              dueDate={item.dueDate}
              assignedTo={item.assignedTo?.map((item) => item.profileImageUrl)}
              attachmentCount={item.attachments?.length || 0}
              completedActCount={item.completedActCount || 0}
              actChecklist={item.actChecklist || []}
              onClick={() => {
                handleClick(item._id);
              }}
            />
          ))}
        </div>


      </div>
    </DashboardLayout>
  )
}

export default MyActions