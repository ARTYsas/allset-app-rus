import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { month: 'Янв', revenue: 72000, projects: 3 },
  { month: 'Фев', revenue: 95000, projects: 4 },
  { month: 'Мар', revenue: 84000, projects: 5 },
  { month: 'Апр', revenue: 110000, projects: 6 },
  { month: 'Май', revenue: 123000, projects: 7 },
  { month: 'Июн', revenue: 136000, projects: 6 },
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
        <p className="text-muted-foreground">Доход и активность как самозанятого специалиста</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Доход по месяцам</CardTitle>
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
                    stroke="#4f46e5" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Проекты по месяцам</CardTitle>
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
                    fill="#34d399"
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
              Общий доход (6 мес)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₽620 000</div>
            <p className="text-xs text-muted-foreground">
              +11% к предыдущему полугодию
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
            <div className="text-2xl font-bold">31</div>
            <p className="text-xs text-muted-foreground">
              +5 к прошлому периоду
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
            <div className="text-2xl font-bold text-green-600">100%</div>
            <p className="text-xs text-muted-foreground">
              Все клиенты оставили положительные отзывы
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
