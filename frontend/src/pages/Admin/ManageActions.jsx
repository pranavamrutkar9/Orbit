import React, { useEffect, useState } from 'react'
import DashboardLayout from './../../components/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apiPath';
import { LuFileSpreadsheet } from 'react-icons/lu';
import ActionStatusTabs from '../../components/ActionStatusTabs';
import TaskCard from '../../components/Cards/TaskCard';

const ManageActions = () => {
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

  const handleClick = (actionData) => {
    navigate("/admin/create-action", { state: { actionId: actionData._id } })
  }

  const handleDownloadReport = async () => {
  }

  useEffect(() => {
    getAllActions();
    return () => { }
  }, [filterStatus])
  return (
    <DashboardLayout activeMenu="Manage Actions">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl md:text-2xl font-medium">My Actions</h2>

            <button
              className='lg:hidden flex download-btn'
              onClick={handleDownloadReport}
            >
              <LuFileSpreadsheet className='text-lg' />
              Download Report
            </button>
          </div>

          {tabs?.[0]?.count >= 0 && (
            <div className="flex items-center gap-3">
              <ActionStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />

              <button className="hidden lg:flex download-btn" onClick={handleDownloadReport}>
                <LuFileSpreadsheet className="text-lg" />
                Download Report
              </button>
            </div>
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
                handleClick(item);
              }}
            />
          ))}
        </div>


      </div>
    </DashboardLayout>
  )
}

export default ManageActions