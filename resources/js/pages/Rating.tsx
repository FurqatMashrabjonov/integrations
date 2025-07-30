import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

interface User {
  name: string;
  score: number;
}

export default function RatingPage() {
  const { users } = usePage<{ users: User[] }>().props;
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Reyting', href: '/rating' }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Reyting" />
      <div className="p-4">
        <div className="bg-card rounded-lg shadow overflow-hidden">
          <ul>
            {users.map((user, index) => (
              <li
                key={index}
                className={`flex justify-between items-center px-4 py-3 ${index < users.length - 1 ? 'border-b' : ''}`}
              >
                  <img src="http://avatars.githubusercontent.com/u/61729454?v=4" alt="GitHub Profile" className="w-12 h-12 rounded-full border-2 border-gray-200" />
                <span className="font-medium">{user.name}</span>
                <span className="text-sm text-muted-foreground">{user.score} pts</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
