
import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface DashboardChartsProps {
  articlesData?: ChartData[];
  categoriesData?: ChartData[];
  usersData?: ChartData[];
  newsletterData?: ChartData[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({
  articlesData = [],
  categoriesData = [],
  usersData = [],
  newsletterData = [],
}) => {
  // Dados mock para demonstração
  const mockArticlesData = useMemo(() => [
    { name: 'Jan', articles: 45 },
    { name: 'Fev', articles: 52 },
    { name: 'Mar', articles: 68 },
    { name: 'Abr', articles: 73 },
    { name: 'Mai', articles: 89 },
    { name: 'Jun', articles: 95 },
  ], []);

  const mockCategoriesData = useMemo(() => [
    { name: 'Tecnologia', value: 35, color: '#3b82f6' },
    { name: 'Negócios', value: 25, color: '#ef4444' },
    { name: 'Educação', value: 20, color: '#10b981' },
    { name: 'Saúde', value: 15, color: '#f59e0b' },
    { name: 'Outros', value: 5, color: '#8b5cf6' },
  ], []);

  const mockUsersData = useMemo(() => [
    { name: 'Jan', users: 120 },
    { name: 'Fev', users: 145 },
    { name: 'Mar', users: 189 },
    { name: 'Abr', users: 234 },
    { name: 'Mai', users: 287 },
    { name: 'Jun', users: 342 },
  ], []);

  const mockNewsletterData = useMemo(() => [
    { name: 'Jan', subscriptions: 89 },
    { name: 'Fev', subscriptions: 112 },
    { name: 'Mar', subscriptions: 134 },
    { name: 'Abr', subscriptions: 156 },
    { name: 'Mai', subscriptions: 178 },
    { name: 'Jun', subscriptions: 203 },
  ], []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Linha - Evolução de Artigos */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Evolução de Artigos por Mês
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockArticlesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="articles" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Pizza - Distribuição por Categorias */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Distribuição por Categorias
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={mockCategoriesData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {mockCategoriesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Barras - Crescimento de Usuários */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Crescimento de Usuários
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockUsersData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="users" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Área - Newsletter */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Inscrições na Newsletter
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={mockNewsletterData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="subscriptions" 
              stroke="#f59e0b" 
              fill="#fef3c7"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardCharts;
