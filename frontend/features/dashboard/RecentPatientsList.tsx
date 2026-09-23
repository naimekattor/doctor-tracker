'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { ConditionBadge } from '@/components/ui/Badge';
import { Patient } from '@/types/patient';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface RecentPatientsListProps {
  patients: Patient[];
}

export function RecentPatientsList({ patients }: RecentPatientsListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Patient Registrations</CardTitle>
          <p className="text-xs text-[#5C768D]">Latest admissions tracked across the healthcare network</p>
        </div>
        <Link
          href="/patients"
          className="text-xs font-semibold text-[#00684A] hover:text-[#00ED64] flex items-center gap-1 transition-colors"
        >
          View all patients <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent>
        {patients.length === 0 ? (
          <p className="text-sm text-[#5C768D] py-6 text-center">No recent patient records found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Age / Gender</TableHead>
                <TableHead>Clinical Condition</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Assigned Doctor</TableHead>
                <TableHead>Hospital</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => {
                const doc = typeof patient.doctor === 'object' ? patient.doctor : null;

                return (
                  <TableRow key={patient._id}>
                    <TableCell className="font-medium text-[#1C2D38]">
                      {patient.name}
                    </TableCell>
                    <TableCell className="text-[#5C768D]">
                      {patient.age} yrs • {patient.gender}
                    </TableCell>
                    <TableCell>
                      <ConditionBadge condition={patient.condition} />
                    </TableCell>
                    <TableCell className="text-[#5C768D] font-mono text-xs">
                      {patient.contactPhone}
                    </TableCell>
                    <TableCell>
                      {doc ? (
                        <Link
                          href={`/doctors/${doc._id}`}
                          className="font-medium text-[#00684A] hover:underline"
                        >
                          {doc.name}
                        </Link>
                      ) : (
                        <span className="text-[#5C768D]">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-[#5C768D] text-xs">
                      {doc?.hospital || 'N/A'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
