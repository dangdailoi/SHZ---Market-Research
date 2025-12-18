import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ComposedChart, Area, Line } from 'recharts';
import { BookOpen, Users, GraduationCap, AlertTriangle, TrendingUp, Award, Target, ChevronDown, Filter, BarChart3, PieChart as PieIcon, Activity } from 'lucide-react';

// Data from analysis
const dashboardData = {
  total_centers: 69,
  total_records: 106,
  course_distribution: {
    "HSK cơ bản (1-3)": 66,
    "HSK cao (4-6)": 18,
    "Thiếu nhi/YCT": 9,
    "Giao tiếp": 9
  },
  teacher_distribution: {
    "Việt Nam": 62,
    "VN + Bản xứ": 34,
    "Bản xứ": 5
  },
  textbook_type: {
    "HSK": 26,
    "Hán Ngữ": 18,
    "Tự biên soạn": 11,
    "YCT": 4,
    "Boya": 3,
    "Khác": 27
  },
  output_guarantee: {
    "Có điều kiện": 22,
    "Không": 12,
    "Có": 12
  },
  support_features: {
    "Bài tập về nhà": { yes: 43, no: 1 },
    "Kiểm tra định kỳ": { yes: 4, no: 98 },
    "App học tập": { yes: 4, no: 40 },
    "Hoạt động ngoại khóa": { yes: 10, no: 34 },
    "Video bài giảng": { yes: 24, no: 0 },
    "Nhóm hỗ trợ": { yes: 7, no: 0 }
  },
  fee_by_course: {
    "HSK cơ bản (1-3)": { avg: 4433825, min: 2040000, max: 10420650 },
    "HSK cao (4-6)": { avg: 5715400, min: 4093000, max: 6930000 },
    "Thiếu nhi/YCT": { avg: 3036500, min: 1985000, max: 4088000 },
    "Giao tiếp": { avg: 2060000, min: 2060000, max: 2060000 }
  },
  skills_by_course: {
    "HSK cơ bản (1-3)": { "Nghe": 25, "Nói": 25, "Đọc": 18, "Viết": 18, "Giao tiếp": 33, "Phát âm": 13 },
    "HSK cao (4-6)": { "Nghe": 4, "Nói": 5, "Đọc": 3, "Viết": 4, "Giao tiếp": 3, "Phát âm": 0 },
    "Giao tiếp": { "Nghe": 6, "Nói": 6, "Đọc": 2, "Viết": 2, "Giao tiếp": 4, "Phát âm": 1 },
    "Thiếu nhi/YCT": { "Nghe": 2, "Nói": 1, "Đọc": 2, "Viết": 2, "Giao tiếp": 2, "Phát âm": 0 }
  },
  negative_feedback: [
    { center: "ChineseHSK", issue: "Thiếu quy trình tư vấn rõ ràng" },
    { center: "Newsky", issue: "Tư vấn thiếu tự tin, chưa chuyên nghiệp" },
    { center: "CGE-Hoa Ngữ Quốc Tế", issue: "Tư vấn không nhiệt tình" },
    { center: "Hoa văn SaigonHSK", issue: "Tư vấn không chuyên nghiệp" },
    { center: "HOA NGỮ ĐẮC NHÂN", issue: "Tư vấn không chuyên nghiệp" },
    { center: "Hoa ngữ phong vân", issue: "Tư vấn không chuyên nghiệp" }
  ],
  facility_issues: [
    { type: "CSVC", count: 2, detail: "Cơ sở vật chất cũ/kém" },
    { type: "Tư vấn", count: 2, detail: "Thái độ thờ ơ" },
    { type: "Sale", count: 1, detail: "Áp lực chốt sale cao" }
  ]
};

const COLORS = {
  primary: '#1A4480',
  secondary: '#2D6A4F',
  accent: '#C53030',
  warning: '#E65100',
  success: '#2E7D32',
  purple: '#6B46C1',
  teal: '#0D9488',
  slate: '#475569'
};

const CHART_COLORS = ['#1A4480', '#2D6A4F', '#C53030', '#E65100', '#6B46C1', '#0D9488'];

export default function AcademicDashboard() {
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  // Prepare data for charts
  const courseDistData = Object.entries(dashboardData.course_distribution).map(([name, value]) => ({
    name: name.length > 15 ? name.substring(0, 15) + '...' : name,
    fullName: name,
    value
  }));

  const teacherDistData = Object.entries(dashboardData.teacher_distribution).map(([name, value]) => ({
    name,
    value,
    percent: ((value / 101) * 100).toFixed(0)
  }));

  const feeComparisonData = Object.entries(dashboardData.fee_by_course).map(([name, data]) => ({
    name: name.replace('(1-3)', '').replace('(4-6)', '').trim(),
    fullName: name,
    avg: Math.round(data.avg / 1000000 * 10) / 10,
    min: Math.round(data.min / 1000000 * 10) / 10,
    max: Math.round(data.max / 1000000 * 10) / 10
  }));

  const supportFeatureData = Object.entries(dashboardData.support_features).map(([name, data]) => ({
    name: name.length > 12 ? name.substring(0, 12) + '...' : name,
    fullName: name,
    yes: data.yes,
    no: data.no,
    rate: data.yes + data.no > 0 ? Math.round((data.yes / (data.yes + data.no)) * 100) : 0
  }));

  const getSkillsRadarData = (courseType) => {
    const skills = dashboardData.skills_by_course[courseType] || {};
    const total = Object.values(skills).reduce((a, b) => a + b, 0) || 1;
    return ['Nghe', 'Nói', 'Đọc', 'Viết', 'Giao tiếp', 'Phát âm'].map(skill => ({
      skill,
      value: skills[skill] || 0,
      percent: Math.round(((skills[skill] || 0) / total) * 100)
    }));
  };

  const guaranteeData = Object.entries(dashboardData.output_guarantee).map(([name, value]) => ({
    name,
    value
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 px-4 py-3 rounded-lg shadow-2xl border border-slate-700">
          <p className="text-slate-300 text-sm font-medium mb-1">{payload[0]?.payload?.fullName || label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-white font-bold" style={{ color: entry.color }}>
              {entry.name}: {entry.value}{entry.name.includes('Học phí') ? ' triệu' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const StatCard = ({ icon: Icon, label, value, subValue, color, trend }) => (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700/50 hover:border-slate-600 transition-all hover:shadow-xl hover:shadow-slate-900/50 group">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className={`text-xs px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-white mt-4 group-hover:text-cyan-300 transition-colors">{value}</p>
      <p className="text-slate-400 text-sm mt-1">{label}</p>
      {subValue && <p className="text-slate-500 text-xs mt-1">{subValue}</p>}
    </div>
  );

  const TabButton = ({ id, label, icon: Icon, active }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
        active 
          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30' 
          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  const RiskCard = ({ title, items, color }) => (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-5 border border-slate-700/30`}>
      <h4 className="text-white font-bold mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5" />
        {title}
      </h4>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="text-slate-200 text-sm flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Dashboard Phân Tích Chuyên Môn
                </h1>
                <p className="text-slate-500 text-sm">Trung tâm Hoa Văn SHZ • Dữ liệu 69 trung tâm</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="appearance-none bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 pr-10 text-white text-sm focus:outline-none focus:border-cyan-500"
              >
                <option value="all">Tất cả khóa học</option>
                <option value="HSK cơ bản (1-3)">HSK cơ bản (1-3)</option>
                <option value="HSK cao (4-6)">HSK cao (4-6)</option>
                <option value="Thiếu nhi/YCT">Thiếu nhi/YCT</option>
                <option value="Giao tiếp">Giao tiếp</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <TabButton id="overview" label="Tổng quan chất lượng" icon={BarChart3} active={activeTab === 'overview'} />
          <TabButton id="curriculum" label="Chương trình học" icon={BookOpen} active={activeTab === 'curriculum'} />
          <TabButton id="value" label="Học phí & Giá trị" icon={TrendingUp} active={activeTab === 'value'} />
          <TabButton id="risk" label="Tín hiệu rủi ro" icon={AlertTriangle} active={activeTab === 'risk'} />
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                icon={BookOpen} 
                label="Trung tâm khảo sát" 
                value="69" 
                subValue="106 bản ghi khóa học"
                color="from-cyan-500 to-blue-600"
              />
              <StatCard 
                icon={Users} 
                label="GV Việt Nam" 
                value="61%" 
                subValue="62/101 bản ghi"
                color="from-emerald-500 to-teal-600"
              />
              <StatCard 
                icon={Award} 
                label="Cam kết đầu ra" 
                value="74%" 
                subValue="34/46 có cam kết"
                color="from-violet-500 to-purple-600"
              />
              <StatCard 
                icon={AlertTriangle} 
                label="Có app hỗ trợ" 
                value="4%" 
                subValue="Chỉ 4/106 bản ghi"
                color="from-red-500 to-rose-600"
                trend={-96}
              />
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Course Distribution */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-bold text-white mb-1">Phân bố loại khóa học</h3>
                <p className="text-slate-500 text-sm mb-4">Hỗ trợ xác định khóa học nào cần ưu tiên cải thiện</p>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={courseDistData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {courseDistData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={60}
                      formatter={(value) => <span className="text-slate-300 text-xs">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Teacher Distribution */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-bold text-white mb-1">Phân bố loại giáo viên</h3>
                <p className="text-slate-500 text-sm mb-4">Đánh giá cơ cấu đội ngũ giảng dạy trên thị trường</p>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={teacherDistData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                    <XAxis type="number" stroke="#94a3b8" />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#0D9488" radius={[0, 8, 8, 0]} name="Số lượng" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Support Features */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-1">Tỷ lệ hỗ trợ học tập</h3>
              <p className="text-slate-500 text-sm mb-4">Xác định các dịch vụ hỗ trợ đang thiếu hụt nghiêm trọng trên thị trường</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={supportFeatureData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="yes" stackId="a" fill="#2D6A4F" name="Có" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="no" stackId="a" fill="#C53030" name="Không" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <strong>Cảnh báo:</strong> Kiểm tra định kỳ (4%) và App học tập (9%) là 2 lỗ hổng lớn nhất cần ưu tiên khắc phục.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Curriculum Tab */}
        {activeTab === 'curriculum' && (
          <div className="space-y-6">
            {/* Skills Radar Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-bold text-white mb-1">Kỹ năng đào tạo - HSK cơ bản (1-3)</h3>
                <p className="text-slate-500 text-sm mb-4">Đánh giá sự cân bằng giữa các kỹ năng trong chương trình</p>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={getSkillsRadarData('HSK cơ bản (1-3)')}>
                    <PolarGrid stroke="#475569" />
                    <PolarAngleAxis dataKey="skill" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis stroke="#475569" />
                    <Radar name="HSK 1-3" dataKey="value" stroke="#0D9488" fill="#0D9488" fillOpacity={0.5} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-bold text-white mb-1">Kỹ năng đào tạo - HSK cao (4-6)</h3>
                <p className="text-slate-500 text-sm mb-4">Phát hiện lỗ hổng kỹ năng ở trình độ cao cấp</p>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={getSkillsRadarData('HSK cao (4-6)')}>
                    <PolarGrid stroke="#475569" />
                    <PolarAngleAxis dataKey="skill" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis stroke="#475569" />
                    <Radar name="HSK 4-6" dataKey="value" stroke="#C53030" fill="#C53030" fillOpacity={0.5} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                  <p className="text-amber-400 text-sm">
                    <strong>Phát hiện:</strong> HSK 4-6 hoàn toàn thiếu đào tạo Phát âm (0%) - lỗ hổng cần bổ sung ngay.
                  </p>
                </div>
              </div>
            </div>

            {/* Textbook Analysis */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-bold text-white mb-1">Loại giáo trình sử dụng</h3>
                <p className="text-slate-500 text-sm mb-4">Đánh giá mức độ chuẩn hóa nội dung giảng dạy</p>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={Object.entries(dashboardData.textbook_type).map(([name, value]) => ({ name, value }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={{ stroke: '#64748b' }}
                    >
                      {Object.keys(dashboardData.textbook_type).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-bold text-white mb-1">Cam kết chất lượng đầu ra</h3>
                <p className="text-slate-500 text-sm mb-4">Mức độ cam kết kết quả học tập của thị trường</p>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={guaranteeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#6B46C1" radius={[8, 8, 0, 0]} name="Số lượng" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Skills Comparison Table */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-4">So sánh kỹ năng theo loại khóa</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Kỹ năng</th>
                      <th className="text-center py-3 px-4 text-cyan-400 font-medium">HSK 1-3</th>
                      <th className="text-center py-3 px-4 text-red-400 font-medium">HSK 4-6</th>
                      <th className="text-center py-3 px-4 text-emerald-400 font-medium">Giao tiếp</th>
                      <th className="text-center py-3 px-4 text-violet-400 font-medium">Thiếu nhi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['Nghe', 'Nói', 'Đọc', 'Viết', 'Giao tiếp', 'Phát âm'].map(skill => (
                      <tr key={skill} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="py-3 px-4 text-white font-medium">{skill}</td>
                        <td className="text-center py-3 px-4">
                          <span className={`px-2 py-1 rounded text-sm ${
                            (dashboardData.skills_by_course['HSK cơ bản (1-3)'][skill] || 0) > 15 
                              ? 'bg-cyan-500/20 text-cyan-300' 
                              : 'bg-slate-700 text-slate-400'
                          }`}>
                            {dashboardData.skills_by_course['HSK cơ bản (1-3)'][skill] || 0}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`px-2 py-1 rounded text-sm ${
                            (dashboardData.skills_by_course['HSK cao (4-6)'][skill] || 0) === 0 
                              ? 'bg-red-500/20 text-red-300' 
                              : 'bg-slate-700 text-slate-400'
                          }`}>
                            {dashboardData.skills_by_course['HSK cao (4-6)'][skill] || 0}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className="px-2 py-1 rounded text-sm bg-slate-700 text-slate-400">
                            {dashboardData.skills_by_course['Giao tiếp'][skill] || 0}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`px-2 py-1 rounded text-sm ${
                            (dashboardData.skills_by_course['Thiếu nhi/YCT'][skill] || 0) === 0 
                              ? 'bg-amber-500/20 text-amber-300' 
                              : 'bg-slate-700 text-slate-400'
                          }`}>
                            {dashboardData.skills_by_course['Thiếu nhi/YCT'][skill] || 0}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Value Tab */}
        {activeTab === 'value' && (
          <div className="space-y-6">
            {/* Fee Comparison */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-1">So sánh học phí theo loại khóa (triệu VND)</h3>
              <p className="text-slate-500 text-sm mb-4">Đánh giá mối quan hệ giữa học phí và giá trị học thuật</p>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={feeComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#94a3b8" label={{ value: 'Triệu VND', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="max" fill="#C53030" fillOpacity={0.1} stroke="#C53030" name="Học phí cao nhất" />
                  <Bar dataKey="avg" fill="#0D9488" radius={[4, 4, 0, 0]} name="Học phí trung bình" />
                  <Line type="monotone" dataKey="min" stroke="#6B46C1" strokeWidth={2} name="Học phí thấp nhất" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Value Gap Analysis */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-500/30">
                <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Vùng mất cân bằng giá trị
                </h3>
                <div className="space-y-4">
                  <div className="bg-slate-900/50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">HSK cao (4-6)</span>
                      <span className="text-amber-400 font-bold">5.7 triệu</span>
                    </div>
                    <p className="text-slate-400 text-sm">Học phí cao nhất nhưng:</p>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li className="text-red-400">• 0% có video bài giảng</li>
                      <li className="text-red-400">• 17% có bài tập về nhà</li>
                      <li className="text-red-400">• 0% đào tạo phát âm</li>
                    </ul>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">Thiếu nhi/YCT</span>
                      <span className="text-amber-400 font-bold">3.0 triệu</span>
                    </div>
                    <p className="text-slate-400 text-sm">Đối tượng cần chú ý đặc biệt nhưng:</p>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li className="text-red-400">• 78% thiếu hoạt động ngoại khóa</li>
                      <li className="text-red-400">• 0% đào tạo phát âm hệ thống</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl p-6 border border-emerald-500/30">
                <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Khuyến nghị tăng giá trị (không giảm giá)
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-slate-900/50 rounded-xl p-4">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold flex-shrink-0">1</span>
                    <div>
                      <p className="text-white font-medium">Bổ sung video cho HSK 4-6</p>
                      <p className="text-slate-400 text-sm">Justify học phí cao bằng dịch vụ premium</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-slate-900/50 rounded-xl p-4">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold flex-shrink-0">2</span>
                    <div>
                      <p className="text-white font-medium">Thêm ngoại khóa cho thiếu nhi</p>
                      <p className="text-slate-400 text-sm">Ít nhất 1 hoạt động văn hóa/tháng</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-slate-900/50 rounded-xl p-4">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold flex-shrink-0">3</span>
                    <div>
                      <p className="text-white font-medium">Phát triển app/flashcard</p>
                      <p className="text-slate-400 text-sm">Tạo lợi thế cạnh tranh (chỉ 4% có)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Risk Tab */}
        {activeTab === 'risk' && (
          <div className="space-y-6">
            {/* Risk Indicators */}
            <div className="grid md:grid-cols-3 gap-6">
              <RiskCard 
                title="Rủi ro bỏ học cao"
                color="from-red-500/10 to-rose-500/10"
                items={[
                  "HSK 4-6: Học phí cao, hỗ trợ thấp",
                  "Thiếu kiểm tra định kỳ (4%)",
                  "Đứt gãy hỗ trợ HSK 3→4",
                  "Không có app ôn tập (96%)"
                ]}
              />
              <RiskCard 
                title="Rủi ro chất lượng"
                color="from-amber-500/10 to-orange-500/10"
                items={[
                  "GV HSK5 dạy HSK 4-6",
                  "11% dùng giáo trình tự biên soạn",
                  "26% không cam kết đầu ra",
                  "Thiếu chuẩn hóa quy trình"
                ]}
              />
              <RiskCard 
                title="Rủi ro trải nghiệm"
                color="from-violet-500/10 to-purple-500/10"
                items={[
                  "6 feedback tiêu cực về tư vấn",
                  "2 trung tâm CSVC kém",
                  "1 áp lực chốt sale cao",
                  "Thái độ thờ ơ xuất hiện nhiều"
                ]}
              />
            </div>

            {/* Negative Feedback Detail */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-4">Chi tiết feedback tiêu cực</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Trung tâm</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Vấn đề</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Mức độ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.negative_feedback.map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="py-3 px-4 text-white">{item.center}</td>
                        <td className="py-3 px-4 text-slate-300">{item.issue}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400">Tiêu cực</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Priority Matrix */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-6 border border-cyan-500/30">
              <h3 className="text-lg font-bold text-cyan-400 mb-4">Ma trận ưu tiên hành động</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    Ưu tiên cao - Làm ngay (1-2 tuần)
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• Mini-test 5 phút đầu mỗi buổi học</li>
                    <li>• Tăng thời lượng luyện nói lên 40%</li>
                    <li>• Đào tạo thái độ tư vấn cho staff</li>
                  </ul>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <h4 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    Ưu tiên trung bình - Trong tháng
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• Quay video bài giảng HSK 4-6</li>
                    <li>• Thiết kế 1 hoạt động ngoại khóa/tháng</li>
                    <li>• Bổ sung module phát âm cao cấp</li>
                  </ul>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    Ưu tiên dài hạn - 1-3 tháng
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• Phát triển app/flashcard số hóa</li>
                    <li>• Xây dựng khóa cầu nối HSK 3-4</li>
                    <li>• Chuẩn hóa quy trình đánh giá GV</li>
                  </ul>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <h4 className="text-violet-400 font-bold mb-3 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-violet-500"></span>
                    Chiến lược - 3-6 tháng
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• Định vị thương hiệu premium</li>
                    <li>• Xây dựng hệ thống mentor cá nhân</li>
                    <li>• Tích hợp AI vào học tập</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>Dashboard được thiết kế cho Giáo viên và Điều phối viên học thuật Hoa Văn SHZ</p>
          <p className="mt-1">Dữ liệu: Khảo sát 69 trung tâm tiếng Trung • Cập nhật: Tháng 12/2025</p>
        </div>
      </div>
    </div>
  );
}
