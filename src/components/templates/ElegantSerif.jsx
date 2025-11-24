import React from 'react'
export default function ElegantSerif({ data }) { return (<div style={{ fontFamily: 'Georgia, serif' }}><h1 className="text-2xl font-bold">{data.personalInfo?.fullName || 'Your Name'}</h1></div>) }
