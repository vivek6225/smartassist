import React, { useEffect, useState } from 'react'
import { dummyPlans } from '../assets/assets'

const Credits = () => {

  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPlans = async () => {
    setPlans(dummyPlans)
    setLoading(false)
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className='max-w-7xl h-screen overflow-y-scroll mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <h2 className='text-3xl font-semibold text-center mb-10 xl:ml-30 text-gray-800 dark:text-white'>
        Credits Plans
      </h2>
    </div>
  )
}

export default Credits
