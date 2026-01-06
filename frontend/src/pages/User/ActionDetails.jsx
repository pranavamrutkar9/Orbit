import React, { useEffect, useState } from 'react'
import { API_PATH } from '../../utils/apiPath';
import axiosInstance from '../../utils/axiosInstance';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import InfoCard from '../../components/Cards/InfoCard';
import moment from 'moment';
import AvatarGroup from '../../components/AvatarGroup';
import { LuSquareArrowOutUpRight } from 'react-icons/lu';

const ActionDetails = () => {
  const { id } = useParams();
  const [action, setAction] = useState(null);

  const getStatusTagColor = (status) => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/20";
      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };

  const getActionDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATH.ACTIONS.GET_ACTION_BY_ID(id)
      )

      if (response.data) {
        const actionInfo = response.data
        setAction(actionInfo)
      }

    } catch (error) {
      console.error("Error fetching action details: ", error)
    }
  }

  const updateActChecklist = async (index) => {
    // Create a new checklist array with the updated item
    const newChecklist = action.actChecklist.map((item, i) => 
      i === index ? { ...item, completed: !item.completed } : item
    );

    // Optimistic update
    const optimisticAction = { ...action, actChecklist: newChecklist };
    setAction(optimisticAction);

    try {
      const response = await axiosInstance.put(
        API_PATH.ACTIONS.UPDATE_ACTION_CHECKLIST(id),
        { actChecklist: newChecklist }
      )
      if (response.data && response.data.updatedAction) {
        setAction(response.data.updatedAction)
      }
    } catch (error) {
      console.error("Error updating checklist:", error)
      // Revert to original state on error
      setAction(action)
    }
  }

  const handleLinkClick = (link) => {
    if (!/^https?:\/\//i.test(link)) {
      link = "https://" + link; // Default to HTTPS
    }
    window.open(link, "_blank");
  };

  useEffect(() => {
    if (id) {
      getActionDetailsById()
    }

    return () => { }
  }, [id])

  return (
    <DashboardLayout activeMenu="My Actions">
      <div className="mt-5">
        {action && (
          <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
            <div className="form-card col-span-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base text-xl md:text-xl font-medium">
                  {action?.title}
                </h2>

                <div
                  className={`text-[11px] md:text-[13px] font-medium ${getStatusTagColor(action?.status)} px-4 py-0.5 rounded`}
                >
                  {action?.status}
                </div>
              </div>

              <div className="mt-4">
                <InfoBox label="Description" value={action?.description} />
              </div>

              <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-6 md:col-span-4">
                  <InfoBox label="Priority" value={action?.priority} />
                </div>
                <div className="col-span-6 md:col-span-4">
                  <InfoBox
                    label="Due Date"
                    value={
                      action?.dueDate
                        ? moment(action?.dueDate).format("DD MMM YYYY")
                        : "N/A"
                    }
                  />
                </div>
                <div className="col-span-6 md:col-span-4">
                  <label className='text-xs font-medium text-slate-500'>
                    Assigned To
                  </label>

                  <AvatarGroup
                    avatars={
                      action?.assignedTo?.map((item) => item?.profileImageUrl) ||
                      []
                    }
                    maxVisible={5}
                  />
                </div>
              </div>

              <div className="mt-2">
                <label className="text-xs font-medium text-slate-500">
                  Acts Checklist
                </label>

                {action?.actChecklist?.map((item, index) => (
                  <ActChecklist
                    key={`todo_${index}`}
                    text={item.title}
                    isChecked={item?.completed}
                    onChange={() => updateActChecklist(index)}
                  />
                ))}
              </div>

              {action?.attachments?.length > 0 && (
                <div className="mt-2">
                  <label className="text-xs font-medium text-slate-500">
                    Attachments
                  </label>
                  {action?.attachments?.map((link, index) => (
                    <Attachment
                      key={`link_${index}`}
                      link={link}
                      index={index}
                      onClick={() => handleLinkClick(link)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default ActionDetails

const InfoBox = ({ label, value }) => {
  return <>
    <label className='text-xs font-medium text-slate-500'>{label}</label>

    <p className='text-[12px] md:text-[13px] font-medium text-gray-700 mt-0.5'>
      {value}
    </p>
  </>
}

const ActChecklist = ({ text, isChecked, onChange }) => {
  return <div className="flex items-center gap-3 mt-3">
    <input
      type="checkbox"
      checked={isChecked}
      onChange={onChange}
      className='w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm  outline-none cursor-pointer'
    />

    <p className='text-[13px] text-gray-800'>{text}</p>
  </div>
}

const Attachment = ({ link, index, onClick}) => {
  return <div 
    className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2 cursor-pointer"
    onClick={onClick}
  >
    <div className="flex flex-1 items-center gap-3 border border-gray-100">
      <span className="text-xs text-gray-400 font-semibold mr-2">
        {index < 9 ? `0${index+1}` : `${index+1}`}
      </span>

      <p className='text-xs text-black'>{link}</p>
    </div>
    <LuSquareArrowOutUpRight className='text-gray-400' />
  </div>
}