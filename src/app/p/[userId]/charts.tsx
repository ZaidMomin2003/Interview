// src/app/p/[userId]/charts.tsx
"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function ReadinessChart({ percentage }: { percentage: number}) {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-48 h-48 mx-auto">
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    className="text-card-foreground/10"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="50%"
                    cy="50%"
                />
                <circle
                    className="text-primary"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="50%"
                    cy="50%"
                    style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-foreground">{percentage}%</span>
            </div>
        </div>
    );
}


export function ActivityChart({ data }: { data: any[] }) {
    return (
        <div className="h-[300px] w-full p-2">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            color: 'hsl(var(--foreground))'
                        }}
                    />
                    <Legend wrapperStyle={{fontSize: "12px"}}/>
                    <Line type="monotone" dataKey="Questions" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="Interviews" stroke="hsl(var(--foreground) / 0.5)" strokeWidth={2} />
                    <Line type="monotone" dataKey="Notes" stroke="hsl(var(--muted-foreground))" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
