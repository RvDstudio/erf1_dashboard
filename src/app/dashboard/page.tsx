// Path: src\app\dashboard\page.tsx
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function page() {
  return (
    <>
      <section className="pt-10 pl-10 pr-8 pb">
        <section className="">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$254,000</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
                  <span className="text-green-500">12.04%</span>
                </p>
              </CardContent>
            </Card>
            <Card className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">59,000</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
                  <span className="text-green-500">16.00%</span>
                </p>
              </CardContent>
            </Card>
            <Card className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$24,000</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
                  <span className="text-green-500">11.07%</span>
                </p>
              </CardContent>
            </Card>
            <Card className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15,000</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
                  <span className="text-red-500">4.06%</span>
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </section>

      <div className="pt-5 pl-10 pr-8 pb-10">
        <div className="bg-white  border-gray-200  shadow dark:bg-[#252525] p-8 rounded-lg shadow-xs border dark:border-[#2e2e2e] ">
          <h2 className="text-2xl text-[#374C69] mb-2">Erf1 Zuivel & Meer</h2>
          <p className="text-[#888888]">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore excepturi eligendi voluptate libero eos
            placeat nostrum quo commodi atque eveniet esse odit ab laboriosam, adipisci aspernatur aliquam quisquam
            repellat repudiandae asperiores veniam quibusdam. Dolorum dolorem vero quaerat soluta ipsum beatae aliquam,
            libero sunt totam incidunt obcaecati quis cum maxime est.
          </p>
        </div>
      </div>
    </>
  );
}
