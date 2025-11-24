import React from 'react'
export default function CorporateGray({ data }) { return (<div><h1 className="text-2xl font-bold text-gray-700">{data.personalInfo?.fullName || 'Your Name'}</h1></div>) }
