
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Настройки</h1>
        <p className="text-muted-foreground">Управление настройками аккаунта</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Профиль</CardTitle>
            <CardDescription>
              Обновите ваши персональные данные
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input id="name" defaultValue="Иван Иванов" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Эл. почта</Label>
              <Input id="email" type="email" defaultValue="ivan@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Компания</Label>
              <Input id="company" defaultValue="ООО Тех Решения" />
            </div>
            <Button>Сохранить изменения</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Уведомления</CardTitle>
            <CardDescription>
              Настройте ваши уведомления
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Уведомления по эл. почте</Label>
                <p className="text-sm text-muted-foreground">
                  Получать обновления о состоянии аккаунта
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Обновления проектов</Label>
                <p className="text-sm text-muted-foreground">
                  Получать уведомления об изменениях в проектах
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Маркетинговые рассылки</Label>
                <p className="text-sm text-muted-foreground">
                  Получать информацию о новых функциях и акциях
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Безопасность</CardTitle>
            <CardDescription>
              Управление настройками безопасности
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Текущий пароль</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Новый пароль</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Подтвердите новый пароль</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Button>Обновить пароль</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
