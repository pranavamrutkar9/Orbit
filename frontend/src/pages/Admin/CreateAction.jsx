import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { PRIORITY_DATA } from '../../utils/data'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATH } from '../../utils/apiPath'
import toast from 'react-hot-toast'
import { useNavigate, useLocation } from 'react-router-dom'
import moment from 'moment'
import { LuTrash2 } from 'react-icons/lu'
import SelectDropdown from '../../components/Inputs/SelectDropdown'
import SelectUsers from '../../components/Inputs/SelectUsers'
import ActListInput from '../../components/Inputs/ActListInput'
import AddAttachmentsInput from '../../components/Inputs/AddAttachmentsInput'
import Modal from './../../components/Modal';
import DeleteAlert from '../../components/DeleteAlert'

const CreateAction = () => {
  const location = useLocation();
  const { actionId } = location.state || {}
  const navigate = useNavigate();

  const [actionData, setActionData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
    assignedTo: [],
    actChecklist: [],
    attachments: []
  })

  const [currentAction, setCurrentAction] = useState(null)

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false)

  const handleValueChange = (key, value) => {
    setActionData((prev) => ({ ...prev, [key]: value }))
  }

  const clearData = () => {
    // reset form
    setActionData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: null,
      assignedTo: [],
      actChecklist: [],
      attachments: []
    })
  }

  const createAction = async () => {
    setLoading(true)

    try {
      const actList = actionData.actChecklist?.map((item)=>({
        title: item,
        completed: false,
      }))

      const response = await axiosInstance.post(API_PATH.ACTIONS.CREATE_ACTION, {
        ...actionData,
        dueDate: new Date(actionData.dueDate).toISOString(),
        actChecklist: actList,
      })
      toast.success("Action Created Successfully")
      navigate("/admin/actions")
      clearData()
    } catch (error) {
      console.error("Error creating action:", error)
      toast.error("Error creating action")
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const updateAction = async () => {
    setLoading(true)

    try {
      const actChecklist = actionData.actChecklist?.map((item)=>{
        const prevActCheckList = currentAction?.actChecklist || []
        const matchedAct = prevActCheckList.find((act)=> act.title == item)

        return {
          title: item,
          completed: matchedAct?.completed || false
        }
      })

      const response = await axiosInstance.put(
        API_PATH.ACTIONS.UPDATE_ACTION(actionId),
        {
          ...actionData,
          dueDate: new Date(actionData.dueDate).toISOString(),
          actChecklist: actChecklist,
        }
      )

      toast.success("Action Updated Successfully")
      navigate("/admin/actions")
      clearData()
    } catch (error) {
      console.error("Error updating action:", error)
      toast.error("Error updating action")
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    setError(null)

    // input validation
    if(!actionData.title.trim()){
      setError("Title is required")
      return
    }
    if(!actionData.dueDate){
      setError("Due Date is required")
      return
    }
    if(actionData.assignedTo.length === 0){
      setError("Action must be assigned to at least one user")
      return
    }
    if(actionData.actChecklist.length === 0){
      setError("Action must have at least one checklist item")
      return
    }

    if(actionId){
      updateAction()
      return
    }

    createAction()
  }

  const getActionDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATH.ACTIONS.GET_ACTION_BY_ID(actionId)
      )

      if(response.data){
        const actionInfo = response.data
        setCurrentAction(actionInfo)

        setActionData((prevState)=>({
          title: actionInfo.title,
          description: actionInfo.description,
          priority: actionInfo.priority,
          dueDate: actionInfo.dueDate
            ? moment(actionInfo.dueDate).format("YYYY-MM-DD")
            : null,
          assignedTo: actionInfo.assignedTo?.map((item)=> item?._id) || [],
          actChecklist: 
            actionInfo?.actChecklist?.map((item)=>item.title) || [],
          attachments: actionInfo?.attachments || []
        }))
      }
    } catch (error) {
      console.error("Error fetching action details: ", error)
    }
  }

  const deleteAction = async () => {
    try {
      await axiosInstance.delete(API_PATH.ACTIONS.DELETE_ACTION(actionId))
      setOpenDeleteAlert(false)
      toast.success("Action Deleted Successfully")
      navigate("/admin/actions")
    } catch (error) {
      console.error("Error deleting Action: ", error)
      toast.error("Unable to delete Action")
    }
  }

  useEffect(() => {
    if(actionId){
      getActionDetailsById(actionId)
    }
    return () => {}
  }, [actionId])
  

  return (
    <DashboardLayout activeMenu="Create Action">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className='text-xl md:text-xl font-medium'>
                {actionId ? "Update Action" : "Create Action"}
              </h2>

              {actionId && (
                <button
                  className='flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer'
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className='' /> Delete
                </button>
              )}
            </div>

            <div className="mt-4">
              <label className='text-xs font-medium text-slate-600'>
                Title
              </label>

              <input
                className='form-input'
                placeholder='Action Title'
                value={actionData.title}
                onChange={({ target }) =>
                  handleValueChange("title", target.value)
                }
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Description
              </label>
              <textarea
                placeholder="Describe action"
                className="form-input"
                rows={4}
                value={actionData.description}
                onChange={({ target }) =>
                  handleValueChange("description", target.value)
                }
              />
            </div>

            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Priority
                </label>
                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={actionData.priority}
                  onChange={(value) => handleValueChange("priority", value)}
                  placeholder="Select Priority"
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Due Date
                </label>

                <input
                  placeholder="Create App UI"
                  className="form-input"
                  value={actionData.dueDate || ""}
                  onChange={({ target }) =>
                    handleValueChange("dueDate", target.value)
                  }
                  type="date"
                />
              </div>

              <div className="col-span-12 md:col-span-3">
                <label className="text-xs font-medium text-slate-600">
                  Assign To
                </label>
                <SelectUsers
                  selectedUsers={actionData.assignedTo}
                  setSelectedUsers={(value) => {
                    handleValueChange("assignedTo", value);
                  }}
                />
              </div>

            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Acts Checklist
              </label>
              <ActListInput
                actList={actionData?.actChecklist}
                setActList={(value) =>
                  handleValueChange("actChecklist", value)
                }
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Add Attachments
              </label>

              <AddAttachmentsInput
                attachments={actionData.attachments}
                setAttachments={(value) =>
                  handleValueChange("attachments", value)
                }
              />
            </div>

            {error && (
              <p className='text-xs font-medium text-red-500 mt-5'>{error}</p>
            )}

            <div className='flex justify-end mt-7'>
              <button
                className='add-btn'
                onClick={handleSubmit}
                disabled={loading}
              >
                {actionId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      </div>


      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Action"
      >
        <DeleteAlert
          content="Are you sure you want to delete this action?"
          onDelete={()=>deleteAction()}
        />
      </Modal>
    </DashboardLayout>
  )
}

export default CreateAction