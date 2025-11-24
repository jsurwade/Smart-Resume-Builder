import React from 'react'
export default function CreativeSplit({ data }) { return (<div><h1 className="text-2xl font-bold">{data.personalInfo?.fullName || 'Your Name'}</h1></div>) }
