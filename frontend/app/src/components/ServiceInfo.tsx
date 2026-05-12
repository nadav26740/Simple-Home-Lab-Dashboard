import "./ServiceInfo.css";

import React from 'react';
import { useDisableService, useEnableService, useServiceInfo } from '@/api/hooks';
import { ServiceFullInfo } from "@/api";

function ServiceInfo({ processName }: any) 
{
    const { data: serviceInfo, loading, error } = useServiceInfo(processName);

    const disableService = async (serviceName: string) => {
        // Implement disable logic here
        console.log(`Disabling service: ${serviceName}`);
        useDisableService().disable(serviceName);
    }

    const enableService = async (serviceName: string) => {
        // Implement disable logic here
        console.log(`Enabling service: ${serviceName}`);
        useEnableService().enable(serviceName);
    }


    const handleToggleEnable = async (data: ServiceFullInfo | null ) => 
    {
        window.alert("not implemented yet");
        return;

        if (!data) return;

        // Implement enable/disable logic here
        if (window.confirm(`Are you sure you want to ${data.enabled ? 'disable' : 'enable'} the service "${data.name}"?`)) {
            // Call the appropriate API function based on current state
            if (data.enabled) {
                await disableService(data.name);
            } else {
                await enableService(data.name);
            }
        }
    }

    console.log(serviceInfo);

  return (
    <>
        {/* <div>Memory Usage: {serviceInfo?.memory} Bytes</div> */}
        {/* <div>CPU Usage: {serviceInfo?.cpu} seconds</div> */}
        <div className="info-Grid">
            <h2 className="full-line">{serviceInfo?.name}</h2>
            {/* <div>Loaded: {serviceInfo?.loaded}</div> */}
            <h3>Main Pid: {serviceInfo?.main_pid}</h3>
            <span className={`Badge ${serviceInfo?.active == 'active' ? 'enabled' : 'disabled'}`}>Status: {serviceInfo?.active}</span>
            <div>Control Group: {serviceInfo?.cgroup}</div>
            <span className={`Badge ${serviceInfo?.enabled ? 'enabled' : 'disabled'}`} onClick={() => handleToggleEnable(serviceInfo)}>Enabled: {serviceInfo?.enabled ? "enabled" : "disabled"}</span>
            <div className="logs full-line">
                <h2>Last Logs:</h2>
                <ul>
                    {serviceInfo?.last_logs.map((log, index) => (
                        <li key={index}>{log}</li>
                    ))}
                </ul>
            </div>
        </div>
    </>
  )
}

export default ServiceInfo