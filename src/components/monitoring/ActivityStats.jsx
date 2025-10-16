import React from 'react';
import { useActivityStats } from '../../hooks/useMonitoring';
import { Card, Spinner, Button } from '../ui';
import { BarChart3, TrendingUp, Users, Activity, RefreshCw } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ActivityStats = () => {
  const { data: stats, isLoading, isError, error, refetch } = useActivityStats();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
              Erreur de chargement
            </h3>
            <p className="text-sm text-red-600 dark:text-red-300 mt-1">
              {error?.message || 'Impossible de charger les statistiques'}
            </p>
          </div>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  if (!stats?.data) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Aucune donnée statistique disponible</p>
      </div>
    );
  }

  const { totals, topActions, dailyActivity } = stats.data;

  // Couleurs pour les graphiques
  const colors = ['#3B82F6', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444'];

  // Données pour le graphique en secteurs
  const pieData = [
    { name: 'Succès', value: totals.successLogs, color: '#10B981' },
    { name: 'Échecs', value: totals.failureLogs, color: '#EF4444' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Statistiques d'Activité
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Analyse des activités sur les {stats.data.period?.days || 30} derniers jours
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Cartes de statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
              <BarChart3 className="w-6 h-6 text-primary-600 dark:text-primary-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Activités</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {totals.totalLogs.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-success-100 dark:bg-success-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-success-600 dark:text-success-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Taux de Succès</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {totals.successRate}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-accent-100 dark:bg-accent-900/20 rounded-lg">
              <Users className="w-6 h-6 text-accent-600 dark:text-accent-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Utilisateurs Actifs</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {totals.uniqueUsers}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-error-100 dark:bg-error-900/20 rounded-lg">
              <Activity className="w-6 h-6 text-error-600 dark:text-error-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Échecs</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {totals.failureLogs}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activité quotidienne */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
            Activité Quotidienne (7 derniers jours)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('fr-FR', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(date) => new Date(date).toLocaleDateString('fr-FR')}
                  formatter={(value) => [value, 'Activités']}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#0EA5E9', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Répartition succès/échecs */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
            Répartition Succès/Échecs
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Activités']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Top actions */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
          Actions les Plus Fréquentes
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topActions.slice(0, 10)} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="action" type="category" width={120} />
              <Tooltip formatter={(value) => [value, 'Occurrences']} />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Liste détaillée des actions */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
          Détail des Actions
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Occurrences
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Pourcentage
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {topActions.map((action, index) => (
                <tr key={action.action} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3`} style={{ backgroundColor: colors[index % colors.length] }}></div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {action.action}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {action.count.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {((action.count / totals.totalLogs) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ActivityStats;