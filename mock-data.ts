import { User, Vessel, Report, DashboardStats } from "@/types";

export const mockUsers: User[] = [
  { id: '1', name: 'Shanthi', email: 'admin@inspection.com', role: 'ADMIN' },
  { id: '2', name: 'Sam', email: 'user@inspection.com', role: 'STAFF' },
  { id: '3', name: 'Robert', email: 'supt@inspection.com', role: 'SUPERINTENDENT' },
];

export const mockVessels: Vessel[] = [
  { id: 'v1', vessel_name: 'Sea Voyager', imo_number: '9876543', vessel_type: 'Oil Tanker', company_id: 'c1', created_at: '2024-01-01' },
  { id: 'v2', vessel_name: 'Ocean Grace', imo_number: '1234567', vessel_type: 'Container Ship', company_id: 'c1', created_at: '2024-01-01' },
  { id: 'v3', vessel_name: 'Arctic Star', imo_number: '5566778', vessel_type: 'Bulk Carrier', company_id: 'c2', created_at: '2024-01-01' },
  { id: 'v4', vessel_name: 'Solaris', imo_number: '8899001', vessel_type: 'LNG Carrier', company_id: 'c2', created_at: '2024-01-01' },
];

export const mockReports: Report[] = [
  {
    id: 1,
    company_id: 'c1',
    vessel_id: 'v1',
    report_data: {},
    status: 'APPROVED',
    created_by: 'Sam',
    created_at: '2024-03-15'
  },
  {
    id: 2,
    company_id: 'c1',
    vessel_id: 'v2',
    report_data: {},
    status: 'Pending',
    created_by: 'Robert',
    created_at: '2024-03-20'
  }
];

export const mockStats: DashboardStats = {
  totalVessels: 4,
  totalReports: 2,
  pendingApprovals: 1,
  approvedReports: 1,
};
