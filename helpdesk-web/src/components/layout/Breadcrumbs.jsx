import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNameMap = {
  dashboard: 'Dashboard',
  tickets: 'Danh sách phiếu',
  new: 'Tạo phiếu mới',
  'knowledge-base': 'Cơ sở tri thức',
  reports: 'Báo cáo SLA',
  admin: 'Quản trị hệ thống',
  users: 'Người dùng',
  departments: 'Phòng ban',
  'sla-policies': 'Chính sách SLA',
  profile: 'Hồ sơ cá nhân',
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
      <Link
        to="/dashboard"
        className="flex items-center hover:text-primary-600 transition-colors"
      >
        <Home className="w-3.5 h-3.5 mr-1 text-slate-400" />
        <span>Trang chủ</span>
      </Link>

      {pathnames.map((segment, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeNameMap[segment] || segment;

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            {isLast ? (
              <span className="text-slate-800 font-semibold truncate max-w-[200px]">
                {displayName}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-primary-600 transition-colors truncate max-w-[150px]"
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
