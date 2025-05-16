import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { month: 'Янв', revenue: 120000, projects: 14 },
  { month: 'Фев', revenue: 95000, projects: 11 },
  { month: 'Мар', revenue: 180000, projects: 18 },
  { month: 'Апр', revenue: 210000, projects: 22 },
  { month: 'Май', revenue: 270000, projects: 26 },
  { month: 'Июн', revenue: 320000, projects: 24 },
];

const customTooltipStyle = {
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  padding: '10px',
  borderRadius: '5px',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={customTooltipStyle}>
        <p className="text-sm font-medium">{`Месяц: ${label}`}</p>
        {payload[0]?.name === "revenue" && 
          <p className="text-sm">{`Доход: ${payload[0].value.toLocaleString()} ₽`}</p>}
        {payload[0]?.name === "projects" && 
          <p className="text-sm">{`Проекты: ${payload[0].value}`}</p>}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Аналитика</h1>
        <p className="text-muted-foreground">Анализ эффективности бизнеса</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Обзор доходов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    name="revenue"
                    dataKey="revenue" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Завершенные проекты</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    name="projects"
                    dataKey="projects" 
                    fill="#82ca9d"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Общий доход
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₽1 970 000</div>
            <p className="text-xs text-muted-foreground">
              +18.4% к прошлому месяцу
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Завершено проектов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">138</div>
            <p className="text-xs text-muted-foreground">
              +8 к прошлому месяцу
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Удовлетворенность клиентов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">97%</div>
            <p className="text-xs text-muted-foreground">
              +1% к прошлому месяцу
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
