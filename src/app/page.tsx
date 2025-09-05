// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';

// import { 
//   Category,
//   Service,
//   Branch,
//   Offer,
//   subscribeToCategoriesChanges,
//   subscribeToServicesChanges,
//   subscribeToBranchesChanges,
//   subscribeToOffersChanges
// } from '@/lib/firebaseServicesNoStorage';

// export default function Dashboard() {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [services, setServices] = useState<Service[]>([]);
//   const [branches, setBranches] = useState<Branch[]>([]);
//   const [offers, setOffers] = useState<Offer[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Subscribe to real-time updates
//   useEffect(() => {
//     console.log('📊 Dashboard: Starting Firebase subscriptions');
//     let loadedCount = 0;
//     const totalCollections = 4;

//     const checkAllLoaded = () => {
//       loadedCount++;
//       console.log(`📊 Dashboard: Collection loaded (${loadedCount}/${totalCollections})`);
//       if (loadedCount === totalCollections) {
//         console.log('📊 Dashboard: All collections loaded, setting loading to false');
//         setLoading(false);
//       }
//     };

//     const unsubscribeCategories = subscribeToCategoriesChanges(
//       (updatedCategories) => {
//         console.log('📊 Dashboard: Categories data received:', updatedCategories.length, 'items');
//         setCategories(updatedCategories);
//         checkAllLoaded();
//       },
//       (error) => {
//         console.error('📊 Dashboard: Categories error:', error);
//         checkAllLoaded();
//       }
//     );

//     const unsubscribeServices = subscribeToServicesChanges(
//       (updatedServices) => {
//         console.log('📊 Dashboard: Services data received:', updatedServices.length, 'items');
//         setServices(updatedServices);
//         checkAllLoaded();
//       },
//       (error) => {
//         console.error('📊 Dashboard: Services error:', error);
//         checkAllLoaded();
//       }
//     );

//     const unsubscribeBranches = subscribeToBranchesChanges(
//       (updatedBranches) => {
//         console.log('📊 Dashboard: Branches data received:', updatedBranches.length, 'items');
//         setBranches(updatedBranches);
//         checkAllLoaded();
//       },
//       (error) => {
//         console.error('📊 Dashboard: Branches error:', error);
//         checkAllLoaded();
//       }
//     );

//     const unsubscribeOffers = subscribeToOffersChanges(
//       (updatedOffers) => {
//         console.log('📊 Dashboard: Offers data received:', updatedOffers.length, 'items');
//         setOffers(updatedOffers);
//         checkAllLoaded();
//       },
//       (error) => {
//         console.error('📊 Dashboard: Offers error:', error);
//         checkAllLoaded();
//       }
//     );

//     return () => {
//       console.log('📊 Dashboard: Cleaning up Firebase subscriptions');
//       unsubscribeCategories();
//       unsubscribeServices();
//       unsubscribeBranches();
//       unsubscribeOffers();
//     };
//   }, []);

//   // Stats calculations
//   const menServices = services.filter(service => service.category.toLowerCase().includes('men'));
//   const womenServices = services.filter(service => service.category.toLowerCase().includes('women'));
//   const activeServices = services.filter(service => service.isActive);
//   const activeOffers = offers.filter(offer => offer.isActive && new Date(offer.validTo) >= new Date());
//   const totalRevenue = services.reduce((sum, service) => sum + (service.price || 0), 0);

//   const stats = [
//     { 
//       name: 'Total Services', 
//       value: services.length.toString(), 
//       change: `${activeServices.length} active`,
//       color: 'pink'
//     },
//     { 
//       name: 'Categories', 
//       value: categories.length.toString(), 
//       change: `${categories.filter(cat => cat.serviceCount > 0).length} with services`,
//       color: 'blue'
//     },
//     { 
//       name: 'Active Offers', 
//       value: activeOffers.length.toString(), 
//       change: `AED ${totalRevenue.toFixed(0)} total value`,
//       color: 'purple'
//     },
//     { 
//       name: 'Services by Gender', 
//       value: `${menServices.length}M / ${womenServices.length}F`, 
//       change: 'Gender split',
//       color: 'green'
//     }
//   ];

//   // Recent activity
//   const recentActivity = [
//     ...services.slice(0, 2).map(service => ({
//       action: 'Service added',
//       item: service.name,
//       time: service.createdAt ? getTimeAgo(service.createdAt.toDate()) : 'Recently',
//       type: 'service'
//     })),
//     ...categories.slice(0, 2).map(category => ({
//       action: 'Category added',
//       item: category.name,
//       time: category.createdAt ? getTimeAgo(category.createdAt.toDate()) : 'Recently',
//       type: 'category'
//     })),
//     ...branches.slice(0, 1).map(branch => ({
//       action: 'Branch added',
//       item: branch.name,
//       time: branch.createdAt ? getTimeAgo(branch.createdAt.toDate()) : 'Recently',
//       type: 'branch'
//     }))
//   ].slice(0, 5);

//   const quickActions = [
//     { name: 'Add Service', href: '/services', icon: '✂' },
//     { name: 'Add Category', href: '/catagories', icon: '📂' },
//     { name: 'Create Offer', href: '/offers', icon: '🏷' },
//   ];

//   // Time ago
//   function getTimeAgo(date: Date): string {
//     const now = new Date();
//     const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
//     if (diffInSeconds < 60) return 'Just now';
//     if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
//     if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
//     return `${Math.floor(diffInSeconds / 86400)}d ago`;
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

//       {/* Stats Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {(loading ? Array.from({ length: 4 }) : stats).map((stat, index) => (
//           <div
//             key={index}
//             className={`rounded-xl p-4 shadow-md border bg-white animate-fade-in`}
//             style={{ animationDelay: `${index * 200}ms` }}
//           >
//             {loading ? (
//               <div className="animate-pulse space-y-3">
//                 <div className="h-4 bg-gray-200 rounded w-1/3"></div>
//                 <div className="h-6 bg-gray-300 rounded w-1/2"></div>
//                 <div className="h-3 bg-gray-200 rounded w-1/4"></div>
//               </div>
//             ) : (
//               <>
//                 <p className="text-sm font-medium text-gray-500">{stat.name}</p>
//                 <p className="text-2xl font-bold mt-2">{stat.value}</p>
//                 <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
//               </>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Quick Actions */}
//       <div className="mb-8">
//         <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
//         <div className="flex gap-4">
//           {quickActions.map((action, i) => (
//             <Link
//               key={i}
//               href={action.href}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
//             >
//               {action.icon} {action.name}
//             </Link>
//           ))}
//         </div>
//       </div>

//       {/* Recent Activity */}
//       <div>
//         <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
//         <div className="space-y-3">
//           {loading ? (
//             Array.from({ length: 3 }).map((_, idx) => (
//               <div
//                 key={idx}
//                 className="animate-pulse h-12 bg-gray-200 rounded-md"
//                 style={{ animationDelay: `${idx * 150}ms` }}
//               />
//             ))
//           ) : (
//             recentActivity.map((activity, idx) => (
//               <div
//                 key={idx}
//                 className="p-4 bg-white rounded-lg border shadow-sm flex justify-between"
//                 style={{ animationDelay: `${idx * 150}ms` }}
//               >
//                 <span>{activity.action}: <b>{activity.item}</b></span>
//                 <span className="text-sm text-gray-400">{activity.time}</span>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// code no 2
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AccessWrapper from '@/components/AccessWrapper';
import { 
  Category,
  Service,
  Branch,
  Offer,
  subscribeToCategoriesChanges,
  subscribeToServicesChanges,
  subscribeToBranchesChanges,
  subscribeToOffersChanges
} from '@/lib/firebaseServicesNoStorage';

export default function Dashboard() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to real-time updates
  useEffect(() => {
    let loadedCount = 0;
    const totalCollections = 4;
    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === totalCollections) setLoading(false);
    };

    const unsubscribeCategories = subscribeToCategoriesChanges(
      (updatedCategories) => { setCategories(updatedCategories); checkAllLoaded(); }
    );

    const unsubscribeServices = subscribeToServicesChanges(
      (updatedServices) => { setServices(updatedServices); checkAllLoaded(); }
    );

    const unsubscribeBranches = subscribeToBranchesChanges(
      (updatedBranches) => { setBranches(updatedBranches); checkAllLoaded(); }
    );

    const unsubscribeOffers = subscribeToOffersChanges(
      (updatedOffers) => { setOffers(updatedOffers); checkAllLoaded(); }
    );

    return () => {
      unsubscribeCategories();
      unsubscribeServices();
      unsubscribeBranches();
      unsubscribeOffers();
    };
  }, []);

  // Stats calculations (real-time)
  const menServices = services.filter(service => service.category.toLowerCase().includes('men'));
  const womenServices = services.filter(service => service.category.toLowerCase().includes('women'));
  const activeServices = services.filter(service => service.isActive);
  const activeOffers = offers.filter(offer => offer.isActive && new Date(offer.validTo) >= new Date());
  const totalRevenue = services.reduce((sum, service) => sum + (service.price || 0), 0);

  const stats = [
    { name: 'Total Services', value:services.length.toString(), change: `${activeServices.length} active`, color: 'pink' },
    { name: 'Categories', value: categories.length.toString(), change: `${categories.filter(cat => cat.serviceCount > 0).length} with services`, color: 'blue' },
    { name: 'Active Offers', value: offers.length.toString(), change: `AED ${totalRevenue.toFixed(0)} total value`, color: 'purple' },
    //{ name: 'Services by Gender', value: `${menServices.length}M / ${womenServices.length}F`, change: 'Gender split', color: 'green' }
  ];

  // Recent activity
  const recentActivity = [
    ...services.slice(0, 2).map(service => ({ action: 'Service added', item: service.name, time: service.createdAt ? getTimeAgo(service.createdAt.toDate()) : 'Recently', type: 'service' })),
    ...categories.slice(0, 2).map(category => ({ action: 'Category added', item: category.name, time: category.createdAt ? getTimeAgo(category.createdAt.toDate()) : 'Recently', type: 'category' })),
    ...branches.slice(0, 1).map(branch => ({ action: 'Branch added', item: branch.name, time: branch.createdAt ? getTimeAgo(branch.createdAt.toDate()) : 'Recently', type: 'branch' }))
  ].slice(0, 5);

  const quickActions = [
    { name: 'Add Service', href: '/services', icon: '✂' },
    { name: 'Add Category', href: '/catagories', icon: '📂' },
    { name: 'Create Offer', href: '/offers', icon: '🏷' },
  ];

  function getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  }

  return (
    <AccessWrapper>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {(loading ? Array.from({ length: 4 }) : stats).map((stat, index) => (
          <div key={index} className="rounded-xl p-4 shadow-md border bg-white animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="flex gap-4">
          {quickActions.map((action, i) => (
            <Link key={i} href={action.href} className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
              {action.icon} {action.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
        <div className="space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="animate-pulse h-12 bg-gray-200 rounded-md" style={{ animationDelay: `${idx * 150}ms` }} />
            ))
          ) : (
            recentActivity.map((activity, idx) => (
              <div key={idx} className="p-4 bg-white rounded-lg border shadow-sm flex justify-between" style={{ animationDelay: `${idx * 150}ms` }}>
                <span>{activity.action}: <b>{activity.item}</b></span>
                <span className="text-sm text-gray-400">{activity.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
    </AccessWrapper>
  );
}
