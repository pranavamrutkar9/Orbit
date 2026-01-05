import React from 'react'
import moment from 'moment'

const ActionListTable = ({tableData}) => {
    const getStatusBadgeColor = (status) =>{
        switch (status){
            case 'Completed': return 'bg-green-100 text-green-600 border border-green-200'
            case 'Pending ': return 'bg-purple-100 text-purple-600 border border-purple-200'
            case 'In Progress': return 'bg-cyan-100 text-cyan-600 border border-cyan-200'
            default: return 'bg-gray-100 text-gray-600 border border-gray-200'
        }
    }

    const getPriorityBadgeColor = (priority) =>{
        switch (priority){
            case 'High': return 'bg-red-100 text-red-500 border border-red-200'
            case 'Medium': return 'bg-orange-100 text-orange-500 border border-orange-200'
            case 'Low': return 'bg-green-100 text-green-500 border border-green-200'
            default: return 'bg-gray-100 text-gray-600 border border-gray-200'
        }
    }

  return (
    <div className='overflow-x-auto p-0 rounded-lg mt-3'>
        <table className="min-w-full">
            <thead>
                <tr className="text-left">
                    <th className="px-3 py-3 font-medium text-[13px] text-gray-800">Name</th>
                    <th className="px-3 py-3 font-medium text-[13px] text-gray-800">Status</th>
                    <th className="px-3 py-3 font-medium text-[13px] text-gray-800">Priority</th>
                    <th className="px-3 py-3 font-medium text-[13px] text-gray-800">Created On</th>
                </tr>
            </thead>
            <tbody>
                {tableData.map((action) => (
                    <tr key={action._id} className='border-t border-gray-100'>
                        <td className="my-3 mx-4 text-gray-700 text-[13px] line-clamp-1 overflow-hidden">{action.title}</td>
                        <td className="px-4 py-4">
                            <span className={`px-2 py-1 text-xs rounded inline-block ${getStatusBadgeColor(action.status)}`}>{action.status}</span>
                        </td>
                        <td className="px-4 py-4">
                            <span className={`px-2 py-1 text-xs rounded inline-block ${getPriorityBadgeColor(action.priority)}`}>{action.priority}</span>
                        </td>
                        <td className='px-4 py-4 text-gray-700 text-[13px] text-nowrap hidden md:table-cell'>{action.createdAt ? moment(action.createdAt).format('DD/MM/YYYY') : '-'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default ActionListTable