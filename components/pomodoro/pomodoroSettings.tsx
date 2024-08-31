import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const pomodoroSettings = () => {
  return (
    <Card>
      <CardContent className="m-0 overflow-hidden rounded-xl p-0">
        <div className="flex gap-2">
          <div className="w-32 bg-black">Sidebar</div>
          <div>
            <CardHeader className="px-4 py-6">
              <CardTitle className="text-2xl">Settings</CardTitle>
            </CardHeader>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default pomodoroSettings;
