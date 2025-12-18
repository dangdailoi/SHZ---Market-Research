import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, 
  Legend, ComposedChart, Area, Line 
} from 'recharts';
import { 
  BookOpen, Users, GraduationCap, AlertTriangle, 
  TrendingUp, Award, Target, ChevronDown, 
  BarChart3, Activity 
} from 'lucide-react';

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
  ]
};

const CHART_COLORS = ['#06b6d4', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#0d9488'];

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
    value
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
    no: data.no
  }));

  const getSkillsRadarData = (courseType) => {
    const skills = dashboardData.skills_by_course[courseType] || {};
    return ['Nghe', 'Nói', 'Đọc', 'Viết', 'Giao tiếp', 'Phát âm'].map(skill => ({
      skill,
      value: skills[skill] || 0
    }));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 px-4 py-3 rounded-lg shadow-2xl border border-slate-700">
          <p className="text-slate-300 text-sm font-medium mb-1">{payload[0]?.payload?.fullName || label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-white font-bold" style={{ color: entry.color }}>
              {entry.name}: {entry.value} {entry.dataKey === 'avg' || entry.dataKey === 'min' || entry.dataKey === 'max' ? 'triệu' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const StatCard = ({ icon: Icon, label, value, subValue, color, trend }) => (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700/50 hover:border-slate-600 transition-all group">
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
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Dashboard Phân Tích Chuyên Môn
              </h1>
              <p className="text-slate-500 text-sm">Dữ liệu phân tích 69 trung tâm Hoa Văn</p>
            </div>
          </div>
          <div className="relative">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="appearance-none bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 pr-10 text-white text-sm focus:outline-none focus:border-cyan-500"
            >
              <option value="all">Tất cả khóa học</option>
              {Object.keys(dashboardData.skills_by_course).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          <TabButton id="overview" label="Tổng quan" icon={BarChart3} active={activeTab === 'overview'} />
          <TabButton id="curriculum" label="Chương trình" icon={BookOpen} active={activeTab === 'curriculum'} />
          <TabButton id="value" label="Học phí & Giá trị" icon={TrendingUp} active={activeTab === 'value'} />
          <TabButton id="risk" label="Rủi ro" icon={AlertTriangle} active={activeTab === 'risk'} />
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={BookOpen} label="Trung tâm khảo sát" value="69" subValue="106 bản ghi" color="from-cyan-500 to-blue-600" />
              <StatCard icon={Users} label="GV Việt Nam" value="61%" subValue="62/101 bản ghi" color="from-emerald-500 to-teal-600" />
              <StatCard icon={Award} label="Cam kết đầu ra" value="74%" subValue="34/46 có cam kết" color="from-violet-500 to-purple-600" />
              <StatCard icon={AlertTriangle} label="Có app hỗ trợ" value="4%" trend={-96} color="from-red-500 to-rose-600" />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 h-[400px]">
                <h3 className="text-lg font-bold mb-4">Phân bố loại khóa học</h3>
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie data={courseDistData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                      {courseDistData.map((_, index) => <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 h-[400px]">
                <h3 className="text-lg font-bold mb-4">Loại giáo viên</h3>
                <ResponsiveContainer width="100%" height="80%">
                  <BarChart data={teacherDistData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                    <XAxis type="number" stroke="#94a3b8" />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#0D9488" radius={[0, 8, 8, 0]} name="Số lượng" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Curriculum Tab */}
        {activeTab === 'curriculum' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 h-[400px]">
              <h3 className="text-lg font-bold mb-4">Kỹ năng - HSK 1-3</h3>
              <ResponsiveContainer width="100%" height="80%">
                <RadarChart data={getSkillsRadarData('HSK cơ bản (1-3)')}>
                  <PolarGrid stroke="#475569" />
                  <PolarAngleAxis dataKey="skill" stroke="#94a3b8" />
                  <PolarRadiusAxis stroke="#475569" />
                  <Radar name="HSK 1-3" dataKey="value" stroke="#0D9488" fill="#0D9488" fillOpacity={0.5} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 h-[400px]">
              <h3 className="text-lg font-bold mb-4">Kỹ năng - HSK 4-6</h3>
              <ResponsiveContainer width="100%" height="80%">
                <RadarChart data={getSkillsRadarData('HSK cao (4-6)')}>
                  <PolarGrid stroke="#475569" />
                  <PolarAngleAxis dataKey="skill" stroke="#94a3b8" />
                  <PolarRadiusAxis stroke="#475569" />
                  <Radar name="HSK 4-6" dataKey="value" stroke="#ef4444" fill="#ef4444" fillOpacity={0.5} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Value Tab */}
        {activeTab === 'value' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 h-[400px]">
              <h3 className="text-lg font-bold mb-4">So sánh học phí (triệu VND)</h3>
              <ResponsiveContainer width="100%" height="80%">
                <ComposedChart data={feeComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="max" fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" name="Max" />
                  <Bar dataKey="avg" fill="#0D9488" radius={[4, 4, 0, 0]} name="Trung bình" />
                  <Line type="monotone" dataKey="min" stroke="#8b5cf6" strokeWidth={2} name="Min" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Risk Tab */}
        {activeTab === 'risk' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <RiskCard 
                title="Rủi ro bỏ học cao" 
                color="from-red-500/10 to-rose-500/10" 
                items={["HSK 4-6: Học phí cao, hỗ trợ thấp", "Thiếu kiểm tra định kỳ (4%)", "Không có app ôn tập (96%)"]} 
              />
              <RiskCard 
                title="Rủi ro chất lượng" 
                color="from-amber-500/10 to-orange-500/10" 
                items={["11% dùng giáo trình tự biên", "26% không cam kết đầu ra", "GV HSK5 dạy HSK 4-6"]} 
              />
              <RiskCard 
                title="Rủi ro trải nghiệm" 
                color="from-violet-500/10 to-purple-500/10" 
                items={["6 feedback tiêu cực về tư vấn", "Áp lực chốt sale cao", "Thái độ thờ ơ xuất hiện"]} 
              />
            </div>
            
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-bold text-cyan-400 mb-4">Ma trận ưu tiên hành động</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 rounded-xl p-4 border border-red-500/30">
                  <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2">Làm ngay (1-2 tuần)</h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• Mini-test 5 phút đầu buổi học</li>
                    <li>• Tăng thời lượng luyện nói lên 40%</li>
                  </ul>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-blue-500/30">
                  <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2">Chiến lược lâu dài</h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• Phát triển ứng dụng học tập riêng</li>
                    <li>• Chuẩn hóa quy trình chăm sóc học viên</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
