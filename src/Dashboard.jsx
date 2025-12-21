import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ZAxis, ComposedChart, Line
} from 'recharts';

// =============================================================================
// EMBEDDED DATA - Từ quá trình phân tích trước đó
// =============================================================================

const DATA = {
  academicKPIs: { totalRecords: 106, uniqueSchools: 69, avgFee: 4.48, avgAcademicIndex: 63.1, avgTeacherScore: 40.3, avgClassSize: 10.5, guaranteeRate: 73.9, avgTotalHours: 126.8 },
  marketingKPIs: { totalRecords: 161, uniqueSchools: 154, websiteRate: 38.5, avgDigitalScore: 67.2, avgEngagement: 69.2, avgPlatformCount: 2.3, paidAdsRate: 26.9, seoExcellentRate: 71.4, avgGoogleRating: 4.95 },
  courseData: [
    { courseType: "HSK cơ bản", count: 66, avgFeeM: 4.43, academicIndex: 68.3, teacherScore: 39.1, totalHours: 149.8 },
    { courseType: "HSK cao", count: 18, avgFeeM: 5.72, academicIndex: 56.5, teacherScore: 48.1, totalHours: 94.3 },
    { courseType: "Thiếu nhi", count: 9, avgFeeM: 3.04, academicIndex: 62.5, teacherScore: 36.1, totalHours: 27 },
    { courseType: "Giao tiếp", count: 9, avgFeeM: 2.06, academicIndex: 40.1, teacherScore: 41.1, totalHours: 0 }
  ],
  teacherData: [
    { teacherType: "Việt Nam", count: 62, academicIndex: 63.1, teacherScore: 36.5 },
    { teacherType: "VN + Bản xứ", count: 34, academicIndex: 61.6, teacherScore: 45.4 },
    { teacherType: "Bản xứ", count: 5, academicIndex: 59.6, teacherScore: 61 }
  ],
  radarData: [
    { feature: 'Bài tập', value: 97.7 },
    { feature: 'Tài liệu', value: 77.5 },
    { feature: 'Cam kết', value: 32.1 },
    { feature: 'Ngoại khóa', value: 22.7 },
    { feature: 'App', value: 9.1 },
    { feature: 'Video', value: 100 }
  ],
  platformData: [
    { platform: "Google Maps", rate: 92.8 },
    { platform: "Facebook", rate: 91.9 },
    { platform: "YouTube", rate: 76.9 },
    { platform: "TikTok", rate: 65.5 },
    { platform: "Website", rate: 38.5 },
    { platform: "Instagram", rate: 35.3 }
  ],
  seoData: [
    { level: "Rất tốt", count: 115, color: "#10b981" },
    { level: "Không xuất hiện", count: 27, color: "#ef4444" },
    { level: "Trung bình", count: 6, color: "#f59e0b" },
    { level: "Tốt", count: 2, color: "#22c55e" }
  ],
  messageData: [
    { message: "Không có", count: 36 },
    { message: "Khai giảng", count: 23 },
    { message: "Khác", count: 16 },
    { message: "Ưu đãi", count: 9 },
    { message: "Tổng hợp", count: 8 },
    { message: "Linh hoạt", count: 5 }
  ],
  contentData: [
    { type: "Tuyển sinh", rate: 42.2 },
    { type: "Kiến thức", rate: 40.4 },
    { type: "Ảnh lớp", rate: 31.1 },
    { type: "Video", rate: 13.7 }
  ],
  targetData: [
    { audience: "Người đi làm", rate: 59.7 },
    { audience: "Sinh viên", rate: 44.3 },
    { audience: "Học sinh", rate: 36.4 },
    { audience: "Thiếu nhi", rate: 33.1 },
    { audience: "Doanh nghiệp", rate: 13.9 }
  ],
  crossData: [
    { academicScore: 47.7, digitalScore: 100, teacherScore: 32.5 },
    { academicScore: 100, digitalScore: 58.3, teacherScore: 35 },
    { academicScore: 81, digitalScore: 100, teacherScore: 41.7 },
    { academicScore: 100, digitalScore: 100, teacherScore: 25 },
    { academicScore: 70, digitalScore: 100, teacherScore: 35 },
    { academicScore: 46.4, digitalScore: 10, teacherScore: 52.5 },
    { academicScore: 100, digitalScore: 25, teacherScore: 46.7 },
    { academicScore: 60.7, digitalScore: 58.3, teacherScore: 62.5 },
    { academicScore: 100, digitalScore: 66.7, teacherScore: 45 },
    { academicScore: 75, digitalScore: 100, teacherScore: 47.5 },
    { academicScore: 40, digitalScore: 58.3, teacherScore: 65 },
    { academicScore: 80, digitalScore: 58.3, teacherScore: 50 }
  ]
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

// KPI Card Component
const KPICard = ({ title, value, subtitle, icon, colorClass }) => (
  <div className="bg-gray-800/60 backdrop-blur rounded-xl p-4 border border-gray-700/50 hover:border-gray-600 transition-all">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">{title}</p>
        <p className={`text-2xl font-bold mt-1 ${colorClass}`}>{value}</p>
        {subtitle && <p className="text-gray-500 text-xs mt-0.5">{subtitle}</p>}
      </div>
      <span className="text-xl">{icon}</span>
    </div>
  </div>
);

// Chart Card Component
const ChartCard = ({ title, subtitle, children, insight }) => (
  <div className="bg-gray-800/60 backdrop-blur rounded-xl p-4 border border-gray-700/50">
    <div className="mb-3">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      {subtitle && <p className="text-gray-400 text-xs mt-0.5">{subtitle}</p>}
    </div>
    <div className="h-52">{children}</div>
    {insight && (
      <div className="mt-3 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
        <p className="text-xs text-blue-300">💡 {insight}</p>
      </div>
    )}
  </div>
);

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-2 shadow-xl text-xs">
      <p className="text-white font-medium mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }}>{entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}</p>
      ))}
    </div>
  );
};

// Academic Dashboard
const AcademicDashboard = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-lg font-bold text-white">📚 Dashboard Chuyên Môn</h2>
        <p className="text-gray-400 text-xs">Phân tích chất lượng đào tạo</p>
      </div>
      <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded">Dành cho Ban Học vụ</span>
    </div>

    <div className="grid grid-cols-4 gap-3">
      <KPICard title="Tổng khóa học" value={DATA.academicKPIs.totalRecords} subtitle={`${DATA.academicKPIs.uniqueSchools} trung tâm`} icon="📚" colorClass="text-blue-400" />
      <KPICard title="Học phí TB" value={`${DATA.academicKPIs.avgFee}M`} subtitle="VNĐ/khóa" icon="💰" colorClass="text-emerald-400" />
      <KPICard title="Academic Index" value={DATA.academicKPIs.avgAcademicIndex} subtitle="Điểm giá trị HT" icon="📊" colorClass="text-purple-400" />
      <KPICard title="Tỷ lệ cam kết" value={`${DATA.academicKPIs.guaranteeRate}%`} subtitle="Có cam kết đầu ra" icon="✓" colorClass="text-cyan-400" />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <ChartCard title="Phân bổ loại khóa học" subtitle="Thị phần theo phân khúc" insight="HSK cơ bản chiếm 64% - cơ hội cho HSK cao cấp">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={DATA.courseData} dataKey="count" nameKey="courseType" cx="50%" cy="50%" outerRadius={70} label={({ courseType, count }) => `${courseType}: ${count}`} labelLine={{ stroke: '#64748b' }}>
              {DATA.courseData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Học phí vs Academic Index" subtitle="Giá trị theo loại khóa" insight="HSK cơ bản có Academic Index cao nhất (68.3)">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={DATA.courseData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="courseType" tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <YAxis yAxisId="left" tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            <Bar yAxisId="left" dataKey="avgFeeM" name="Học phí (M)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="academicIndex" name="Academic Index" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Chất lượng giảng viên" subtitle="Score theo loại GV" insight="GV bản xứ cao nhất (61) nhưng chỉ 5% thị trường">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DATA.teacherData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10 }} domain={[0, 80]} />
            <YAxis dataKey="teacherType" type="category" tick={{ fill: '#94a3b8', fontSize: 10 }} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            <Bar dataKey="teacherScore" name="Điểm GV" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            <Bar dataKey="academicIndex" name="Academic" fill="#06b6d4" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Tính năng hỗ trợ học tập" subtitle="% trung tâm có tính năng" insight="App học tập chỉ 9.1% - khoảng trống công nghệ lớn">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={DATA.radarData}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="feature" tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 8 }} />
            <Radar name="%" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} strokeWidth={2} />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  </div>
);

// Marketing Dashboard
const MarketingDashboard = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-lg font-bold text-white">📊 Dashboard Marketing</h2>
        <p className="text-gray-400 text-xs">Phân tích hiện diện số & định vị</p>
      </div>
      <span className="text-xs text-pink-400 bg-pink-500/10 px-2 py-1 rounded">Dành cho Marketing Team</span>
    </div>

    <div className="grid grid-cols-4 gap-3">
      <KPICard title="Trung tâm" value={DATA.marketingKPIs.uniqueSchools} subtitle={`${DATA.marketingKPIs.totalRecords} records`} icon="🏢" colorClass="text-blue-400" />
      <KPICard title="Digital Score" value={DATA.marketingKPIs.avgDigitalScore} subtitle="Điểm hiện diện số" icon="📱" colorClass="text-purple-400" />
      <KPICard title="Có Website" value={`${DATA.marketingKPIs.websiteRate}%`} subtitle="Owned media" icon="🌐" colorClass="text-orange-400" />
      <KPICard title="SEO Tốt" value={`${DATA.marketingKPIs.seoExcellentRate}%`} subtitle="Từ fanpage" icon="🔍" colorClass="text-emerald-400" />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <ChartCard title="Mức độ sử dụng nền tảng" subtitle="% có mặt trên platform" insight="Instagram (35%) và Website (38%) là khoảng trống lớn">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DATA.platformData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10 }} domain={[0, 100]} />
            <YAxis dataKey="platform" type="category" tick={{ fill: '#94a3b8', fontSize: 10 }} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="rate" name="%" radius={[0, 4, 4, 0]}>
              {DATA.platformData.map((entry, i) => (
                <Cell key={i} fill={entry.rate > 70 ? '#10b981' : entry.rate > 40 ? '#f59e0b' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Phân bổ mức SEO" subtitle="Khả năng được tìm thấy" insight="71% rất tốt nhưng chủ yếu từ fanpage - rủi ro FB">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={DATA.seoData} dataKey="count" nameKey="level" cx="50%" cy="50%" outerRadius={70} label={({ level, count }) => `${level}: ${count}`}>
              {DATA.seoData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Thông điệp thương hiệu" subtitle="Loại message chính" insight="22% KHÔNG CÓ thông điệp - cơ hội định vị">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DATA.messageData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="message" tick={{ fill: '#94a3b8', fontSize: 9 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" name="Số lượng" radius={[4, 4, 0, 0]}>
              {DATA.messageData.map((entry, i) => (
                <Cell key={i} fill={entry.message === 'Không có' ? '#ef4444' : COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Đối tượng mục tiêu" subtitle="% nhắm đến phân khúc" insight="Doanh nghiệp chỉ 14% - blue ocean cho B2B">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DATA.targetData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10 }} domain={[0, 100]} />
            <YAxis dataKey="audience" type="category" tick={{ fill: '#94a3b8', fontSize: 10 }} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="rate" name="%" radius={[0, 4, 4, 0]}>
              {DATA.targetData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  </div>
);

// Cross Analysis Dashboard
const CrossAnalysis = () => {
  const gapAnalysis = useMemo(() => {
    const highLow = DATA.crossData.filter(d => d.academicScore > 60 && d.digitalScore < 70).length;
    const lowHigh = DATA.crossData.filter(d => d.academicScore < 50 && d.digitalScore > 70).length;
    return { highAcademicLowDigital: highLow, lowAcademicHighDigital: lowHigh, balanced: DATA.crossData.length - highLow - lowHigh };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-white">🔗 Phân tích chéo Academic-Marketing</h2>
          <p className="text-gray-400 text-xs">Khoảng cách giữa chất lượng và truyền thông</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-emerald-900/30 rounded-xl p-4 border border-emerald-500/30">
          <p className="text-emerald-300 text-xs font-medium">💎 "Kim cương thô"</p>
          <p className="text-3xl font-bold text-white mt-1">{gapAnalysis.highAcademicLowDigital}</p>
          <p className="text-gray-400 text-xs mt-1">Academic cao, Digital thấp</p>
        </div>
        <div className="bg-red-900/30 rounded-xl p-4 border border-red-500/30">
          <p className="text-red-300 text-xs font-medium">⚠️ "Marketing trống"</p>
          <p className="text-3xl font-bold text-white mt-1">{gapAnalysis.lowAcademicHighDigital}</p>
          <p className="text-gray-400 text-xs mt-1">Digital cao, Academic thấp</p>
        </div>
        <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-500/30">
          <p className="text-blue-300 text-xs font-medium">⚖️ Cân bằng</p>
          <p className="text-3xl font-bold text-white mt-1">{gapAnalysis.balanced}</p>
          <p className="text-gray-400 text-xs mt-1">Định vị nhất quán</p>
        </div>
      </div>

      <ChartCard title="Ma trận Academic vs Digital" subtitle="Mỗi điểm = 1 trung tâm" insight="Tương quan r=0.09 - gần như KHÔNG liên hệ giữa chất lượng và hiện diện số">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" dataKey="academicScore" name="Academic" tick={{ fill: '#94a3b8', fontSize: 10 }} domain={[0, 100]} label={{ value: 'Academic Score', position: 'bottom', fill: '#94a3b8', fontSize: 10 }} />
            <YAxis type="number" dataKey="digitalScore" name="Digital" tick={{ fill: '#94a3b8', fontSize: 10 }} domain={[0, 100]} label={{ value: 'Digital Score', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} />
            <ZAxis type="number" dataKey="teacherScore" range={[40, 300]} />
            <Tooltip content={({ payload }) => payload?.[0] ? (
              <div className="bg-gray-900 border border-gray-700 rounded p-2 text-xs">
                <p className="text-blue-400">Academic: {payload[0].payload.academicScore}</p>
                <p className="text-pink-400">Digital: {payload[0].payload.digitalScore}</p>
                <p className="text-emerald-400">Teacher: {payload[0].payload.teacherScore}</p>
              </div>
            ) : null} />
            <Scatter name="Trung tâm" data={DATA.crossData} fill="#3b82f6" fillOpacity={0.7} />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700/50">
          <h3 className="text-sm font-semibold text-white mb-2">🎯 Quick Wins</h3>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• Content video giáo dục</li>
            <li>• Chuẩn hóa cam kết đầu ra</li>
            <li>• Highlight GV bản xứ trong marketing</li>
          </ul>
        </div>
        <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700/50">
          <h3 className="text-sm font-semibold text-white mb-2">⚡ Strategic Actions</h3>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• Xây dựng website riêng</li>
            <li>• Phát triển app học tập</li>
            <li>• Mở rộng phân khúc B2B</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function ChineseLanguageMarketDashboard() {
  const [activeTab, setActiveTab] = useState('academic');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Thị trường Đào tạo Tiếng Trung
          </h1>
          <p className="text-gray-400 text-xs mt-1">Dashboard BI - Khu vực HCM, Bình Dương, Vũng Tàu</p>
          <div className="flex items-center justify-center gap-3 mt-2 text-xs text-gray-500">
            <span>📊 106 khóa học</span>
            <span>•</span>
            <span>🏢 154 trung tâm</span>
            <span>•</span>
            <span>📍 14 khu vực</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-gray-800/50 rounded-xl p-1 border border-gray-700/50">
            {[
              { id: 'academic', label: 'Chuyên môn', icon: '📚' },
              { id: 'marketing', label: 'Marketing', icon: '📊' },
              { id: 'cross', label: 'Phân tích chéo', icon: '🔗' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Content */}
        {activeTab === 'academic' && <AcademicDashboard />}
        {activeTab === 'marketing' && <MarketingDashboard />}
        {activeTab === 'cross' && <CrossAnalysis />}

        {/* Footer */}
        <div className="mt-6 text-center text-gray-500 text-xs">
          <p>Dashboard từ dữ liệu khảo sát thị trường tiếng Trung đã làm sạch</p>
        </div>
      </div>
    </div>
  );
}

