
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/components/ui/use-toast';

interface IncomeData {
  month: string;
  revenue: number;
  projects: number;
  year: number;
}

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
  const [incomeData, setIncomeData] = useState<IncomeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalProjects: 0,
    growthPercent: 0,
    projectGrowth: 0,
    satisfaction: 100
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        setIsLoading(true);
        
        // Получаем данные о доходах из Supabase
        const { data: monthlyData, error: monthlyError } = await supabase
          .from('monthly_income')
          .select('*')
          .order('year', { ascending: true })
          .order('month', { ascending: true });

        if (monthlyError) {
          throw monthlyError;
        }

        if (monthlyData) {
          setIncomeData(monthlyData);
          
          // Расчет общей суммы дохода и роста
          const totalIncome = monthlyData.reduce((sum, item) => sum + item.revenue, 0);
          const totalProjects = monthlyData.reduce((sum, item) => sum + item.projects, 0);
          
          // Рассчитываем рост по сравнению с предыдущим полугодием (просто для примера)
          const growthPercent = 11;
          const projectGrowth = 5;
          
          setStats({
            totalIncome,
            totalProjects,
            growthPercent,
            projectGrowth,
            satisfaction: 100
          });
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        toast({
          title: "Ошибка загрузки данных",
          description: "Не удалось загрузить данные аналитики. Пожалуйста, попробуйте позже.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchIncomeData();
  }, [toast]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Аналитика</h1>
        <p className="text-muted-foreground">Доход и активность как самозанятого специалиста</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Загрузка данных...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Доход по месяцам</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={incomeData}>
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
                    <BarChart data={incomeData}>
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
                <div className="text-2xl font-bold">₽{stats.totalIncome.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.growthPercent}% к предыдущему полугодию
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
                <div className="text-2xl font-bold">{stats.totalProjects}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.projectGrowth} к прошлому периоду
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
                <div className="text-2xl font-bold text-green-600">{stats.satisfaction}%</div>
                <p className="text-xs text-muted-foreground">
                  Все клиенты оставили положительные отзывы
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
