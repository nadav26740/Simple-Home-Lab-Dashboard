import { useState, useMemo } from 'react';
import './AdminList.css';
import { useServices } from '@/api/hooks';

type SortField = 'name' | 'status' | 'cpu' | 'memory' | 'enabled';
type SortOrder = 'asc' | 'desc';

export default function AdminList() {
    const { data: services, loading, error } = useServices(10000);
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    const sortedServices = useMemo(() => {
        if (!services) return [];

        const sorted = [...services].sort((a, b) => {
            let aVal: any;
            let bVal: any;

            // Type-safe property access
            if (sortField === 'cpu' || sortField === 'memory') {
                aVal = a.usage[sortField];
                bVal = b.usage[sortField];
            } else {
                aVal = a[sortField];
                bVal = b[sortField];
            }

            if (typeof aVal === 'string') aVal = aVal.toLowerCase();
            if (typeof bVal === 'string') bVal = bVal.toLowerCase();

            if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return sorted;
    }, [services, sortField, sortOrder]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const getSortIndicator = (field: SortField) => {
        if (sortField !== field) return ' ⇅';
        return sortOrder === 'asc' ? ' ↑' : ' ↓';
    };

    if (loading && !services) return <div className="admin-list-loading">Loading services...</div>;
    if (error) return <div className="admin-list-error">Error: {error.message}</div>;

    return (
        <div className="admin-list">
            <h2>System Services ({sortedServices.length})</h2>
            <div className="services-table-container">
                <table className="services-table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('name')} className="sortable">
                                Service Name{getSortIndicator('name')}
                            </th>
                            <th onClick={() => handleSort('status')} className="sortable">
                                Status{getSortIndicator('status')}
                            </th>
                            <th onClick={() => handleSort('cpu')} className="sortable">
                                CPU{getSortIndicator('cpu')}
                            </th>
                            <th onClick={() => handleSort('memory')} className="sortable">
                                Memory{getSortIndicator('memory')}
                            </th>
                            <th onClick={() => handleSort('enabled')} className="sortable">
                                Enabled{getSortIndicator('enabled')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedServices.map((service) => (
                            <tr key={service.name} className={`list-item`}>
                                <td className="service-name">{service.name}</td>
                                <td className="service-status">
                                    <span className={`status-badge status-${service.status.toLowerCase()}`}>
                                        {service.status}
                                    </span>
                                </td>
                                <td className="service-cpu">{service.usage.cpu.toFixed(2)}%</td>
                                <td className="service-memory">{service.usage.memory.toFixed(2)}%</td>
                                <td className="service-enabled">
                                    <span className={`enabled-badge ${service.enabled ? 'enabled' : 'disabled'}`}>
                                        {service.enabled ? '✓' : '✗'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {sortedServices.length > 10 && (
                <div className="pagination-info">
                    Showing 10 of {sortedServices.length} services
                </div>
            )}
        </div>
    );
}
