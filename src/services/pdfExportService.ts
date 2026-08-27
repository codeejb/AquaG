import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  IncidentAlert, 
  PumpStation, 
  SensorTelemetry, 
  ResponseUnit, 
  TimelineFrame,
  DrainageNode
} from '../types';
import { 
  TOP_EXTREME_RAIN_EVENTS, 
  YEARLY_WEATHER_SUMMARIES, 
  MONTHLY_CLIMATOLOGY,
  DATASET_METADATA 
} from '../data/historicalWeatherData';
import { 
  HOURLY_POWER_LOAD_SERIES, 
  DELHI_URBAN_DEVELOPMENT_ZONES, 
  POWER_LOAD_DATASET_META 
} from '../data/powerLoadDataset';
import { 
  CRITICAL_INFRASTRUCTURE, 
  POPULATION_PRIORITY_ZONES, 
  SMART_EVACUATION_ROUTES,
  INITIAL_DRAINAGE_NODES 
} from '../data/mockData';

export interface PdfExportOptions {
  includeExecutiveSummary?: boolean;
  includeIncidents?: boolean;
  includePumpsAndDrainage?: boolean;
  includeHistoricalClimate?: boolean;
  includePowerGrid?: boolean;
  includeResponseUnits?: boolean;
  includeCriticalInfra?: boolean;
  includeEvacuationRoutes?: boolean;
  agencyName?: string;
  reportTitle?: string;
  notes?: string;
}

export const generateComprehensivePdfReport = (
  incidents: IncidentAlert[],
  pumps: PumpStation[],
  sensors: SensorTelemetry[],
  units: ResponseUnit[],
  timelineFrames: TimelineFrame[],
  options: PdfExportOptions = {}
): jsPDF => {
  const {
    includeExecutiveSummary = true,
    includeIncidents = true,
    includePumpsAndDrainage = true,
    includeHistoricalClimate = true,
    includePowerGrid = true,
    includeResponseUnits = true,
    includeCriticalInfra = true,
    includeEvacuationRoutes = true,
    agencyName = 'Delhi Municipal Emergency Operations Center (EOC)',
    reportTitle = 'MUNICIPAL FLOOD & HYDROLOGICAL INTELLIGENCE DOSSIER',
    notes = 'Official operational dispatch document for municipal flood mitigation and emergency response.',
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let currentY = margin;

  const now = new Date();
  const dateStr = now.toISOString().replace('T', ' ').substring(0, 19);

  // Helper to add Section Header
  const addSectionHeader = (title: string, subtitle?: string) => {
    if (currentY > pageHeight - 35) {
      doc.addPage();
      currentY = margin + 12;
    } else {
      currentY += 6;
    }

    doc.setFillColor(19, 29, 30);
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 8, 1.5, 1.5, 'F');
    
    doc.setFillColor(0, 229, 255);
    doc.rect(margin, currentY, 2.5, 8, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(195, 245, 255);
    doc.text(title.toUpperCase(), margin + 5, currentY + 5.5);

    if (subtitle) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(186, 201, 204);
      doc.text(subtitle, pageWidth - margin - 3, currentY + 5.5, { align: 'right' });
    }

    currentY += 12;
  };

  // -------------------------------------------------------------
  // COVER / MASTER HEADER BANNER
  // -------------------------------------------------------------
  // Top Banner
  doc.setFillColor(19, 29, 30);
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Accent Line
  doc.setFillColor(0, 229, 255);
  doc.rect(0, 27.5, pageWidth, 0.8, 'F');

  // Brand Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('AQUAG GIS 4.2', margin, 12);

  doc.setFontSize(8);
  doc.setTextColor(0, 229, 255);
  doc.text('COMMAND OPERATIONS & HYDRO-DATA PLATFORM', margin, 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(186, 201, 204);
  doc.text(`Agency: ${agencyName}`, margin, 22);

  // Right Side Metadata
  doc.setFontSize(8);
  doc.setTextColor(0, 229, 255);
  doc.text('OFFICIAL OPERATIONAL DISPATCH', pageWidth - margin, 11, { align: 'right' });

  doc.setTextColor(220, 228, 229);
  doc.text(`Generated: ${dateStr}`, pageWidth - margin, 16, { align: 'right' });

  doc.setFontSize(7);
  doc.setTextColor(132, 147, 150);
  doc.text('Sector: Delhi NCR • Hydro Mesh: HEC-RAS 2D (5m)', pageWidth - margin, 21, { align: 'right' });

  currentY = 34;

  // Title block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(reportTitle, margin, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(notes, margin, currentY);
  currentY += 6;

  // -------------------------------------------------------------
  // SECTION 1: EXECUTIVE SUMMARY & METRIC OVERVIEW
  // -------------------------------------------------------------
  if (includeExecutiveSummary) {
    addSectionHeader('1. Executive Operational Summary & Hydrometric Stage', 'REAL-TIME TELEMETRY');

    const criticalIncidents = incidents.filter(i => i.severity === 'CRITICAL').length;
    const warningIncidents = incidents.filter(i => i.severity === 'WARNING').length;
    const totalAtRisk = incidents.reduce((acc, i) => acc + (i.popAtRisk || 0), 0);
    const avgPumpLoad = Math.round(pumps.reduce((acc, p) => acc + p.capacityPct, 0) / (pumps.length || 1));
    const activeUnits = units.filter(u => u.status === 'DISPATCHED' || u.status === 'ON_SITE').length;

    const summaryCards = [
      ['River Yamuna Level', '206.15 m MSL (+0.82m Above Danger Mark 205.33m)', 'CRITICAL'],
      ['Critical Hotspots', `${criticalIncidents} Critical / ${warningIncidents} Warning Zones`, criticalIncidents > 0 ? 'ALERT' : 'NORMAL'],
      ['Exposed Population', `${totalAtRisk.toLocaleString()} Citizens in High Inundation Zones`, 'HIGH VULNERABILITY'],
      ['Pump Fleet Capacity', `${avgPumpLoad}% Average Sump Load across 6 Arterial Stations`, avgPumpLoad > 80 ? 'HIGH LOAD' : 'NORMAL'],
      ['Emergency Response Fleet', `${activeUnits} of ${units.length} Units Active on Field Operations`, 'ACTIVE DISPATCH'],
      ['Hydrodynamic Engine', 'Mesh Nodes: 128,400 • Rain Nowcast: 48 mm/h (Peak 62 mm/h)', '60 FPS SOLVER']
    ];

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Hydrological Parameter', 'Current Operational State', 'Status Code']],
      body: summaryCards,
      theme: 'grid',
      headStyles: {
        fillColor: [19, 29, 30],
        textColor: [0, 229, 255],
        fontStyle: 'bold',
        fontSize: 8,
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [30, 41, 59],
        cellPadding: 2.5,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 48 },
        1: { cellWidth: 105 },
        2: { fontStyle: 'bold', halign: 'center', cellWidth: 33 },
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 2;
  }

  // -------------------------------------------------------------
  // SECTION 2: ACTIVE INCIDENTS & EMERGENCY TRIAGE
  // -------------------------------------------------------------
  if (includeIncidents) {
    addSectionHeader('2. Active Flood Incidents & Triage Register', `${incidents.length} REPORTED HOTSPOTS`);

    const incidentRows = incidents.map(inc => [
      inc.id,
      inc.title,
      inc.zone,
      inc.severity,
      `${inc.depthCm} cm`,
      (inc.popAtRisk || 0).toLocaleString(),
      inc.evacuationStatus,
      inc.dispatched ? 'DISPATCHED' : 'PENDING',
      inc.actionRequired || inc.description,
    ]);

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['ID', 'Incident Location', 'Zone', 'Severity', 'Depth', 'Pop. at Risk', 'Evac Route', 'Dispatch', 'Operational Action Required']],
      body: incidentRows,
      theme: 'grid',
      headStyles: {
        fillColor: [19, 29, 30],
        textColor: [0, 229, 255],
        fontStyle: 'bold',
        fontSize: 7.5,
      },
      bodyStyles: {
        fontSize: 7,
        textColor: [30, 41, 59],
        cellPadding: 2,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 18 },
        1: { fontStyle: 'bold', cellWidth: 28 },
        2: { cellWidth: 20 },
        3: { fontStyle: 'bold', halign: 'center', cellWidth: 16 },
        4: { halign: 'right', cellWidth: 13 },
        5: { halign: 'right', cellWidth: 15 },
        6: { cellWidth: 16 },
        7: { fontStyle: 'bold', halign: 'center', cellWidth: 16 },
        8: { cellWidth: 44 },
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 3) {
          if (data.cell.raw === 'CRITICAL') {
            data.cell.styles.textColor = [220, 38, 38];
            data.cell.styles.fontStyle = 'bold';
          } else if (data.cell.raw === 'WARNING') {
            data.cell.styles.textColor = [217, 119, 6];
          }
        }
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 2;
  }

  // -------------------------------------------------------------
  // SECTION 3: SCADA DRAINAGE & PUMP STATIONS
  // -------------------------------------------------------------
  if (includePumpsAndDrainage) {
    addSectionHeader('3. SCADA Pumping Station Telemetry & Drainage Network', '6 OUTLETS • 5 TRUNK NODES');

    const pumpRows = pumps.map(p => [
      p.code,
      p.name,
      p.status,
      `${p.capacityPct}%`,
      `${p.flowRateLps} / ${p.maxFlowLps} L/s`,
      `${p.activePumps} / ${p.totalPumps}`,
      `${p.sluiceGateOpenPct}%`,
      p.powerSource,
      p.reroutedTo || 'Direct Outfall',
    ]);

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Code', 'Pump Facility', 'Status', 'Load', 'Flow Rate', 'Active Pumps', 'Sluice Open', 'Power Source', 'Bypass Reroute']],
      body: pumpRows,
      theme: 'grid',
      headStyles: {
        fillColor: [19, 29, 30],
        textColor: [0, 229, 255],
        fontStyle: 'bold',
        fontSize: 7.5,
      },
      bodyStyles: {
        fontSize: 7,
        textColor: [30, 41, 59],
        cellPadding: 2,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 18 },
        1: { fontStyle: 'bold', cellWidth: 38 },
        2: { fontStyle: 'bold', halign: 'center', cellWidth: 16 },
        3: { fontStyle: 'bold', halign: 'right', cellWidth: 14 },
        4: { halign: 'right', cellWidth: 26 },
        5: { halign: 'center', cellWidth: 18 },
        6: { halign: 'right', cellWidth: 16 },
        7: { cellWidth: 18 },
        8: { cellWidth: 22 },
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 4;

    // Drainage Nodes Table
    const nodeRows = INITIAL_DRAINAGE_NODES.map((n: DrainageNode) => [
      n.id,
      n.name,
      `${n.flowVolumePct}%`,
      `${n.pressureBar} bar`,
      n.status,
      n.connectedTo.join(', '),
    ]);

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Node ID', 'Drainage Trunk Siphon', 'Flow Volume', 'Pressure', 'Congestion Status', 'Connected Outfalls']],
      body: nodeRows,
      theme: 'grid',
      headStyles: {
        fillColor: [36, 43, 45],
        textColor: [195, 245, 255],
        fontStyle: 'bold',
        fontSize: 7.5,
      },
      bodyStyles: {
        fontSize: 7,
        textColor: [30, 41, 59],
        cellPadding: 2,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 18 },
        1: { fontStyle: 'bold', cellWidth: 62 },
        2: { halign: 'right', cellWidth: 22 },
        3: { halign: 'right', cellWidth: 20 },
        4: { fontStyle: 'bold', halign: 'center', cellWidth: 26 },
        5: { cellWidth: 38 },
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 2;
  }

  // -------------------------------------------------------------
  // SECTION 4: HISTORICAL HYDRO-CLIMATE (1990-2022)
  // -------------------------------------------------------------
  if (includeHistoricalClimate) {
    addSectionHeader('4. Historical Hydro-Meteorological Climate Data (1990–2022)', `${DATASET_METADATA.totalDailyRecords} OBSERVATIONS • WMO 42182`);

    // Top Extreme Rain Events
    const rainRows = TOP_EXTREME_RAIN_EVENTS.slice(0, 10).map((ev, idx) => [
      `#${idx + 1}`,
      ev.date,
      `${ev.rainfallMm} mm`,
      ev.tmax ? `${ev.tmax} °C` : 'N/A',
      ev.severity,
      ev.impactDescription,
    ]);

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Rank', 'Date', '24h Rainfall', 'Max Temp', 'Severity', 'Historical Impact Description']],
      body: rainRows,
      theme: 'grid',
      headStyles: {
        fillColor: [19, 29, 30],
        textColor: [0, 229, 255],
        fontStyle: 'bold',
        fontSize: 7.5,
      },
      bodyStyles: {
        fontSize: 7,
        textColor: [30, 41, 59],
        cellPadding: 2,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        0: { fontStyle: 'bold', halign: 'center', cellWidth: 12 },
        1: { fontStyle: 'bold', cellWidth: 22 },
        2: { fontStyle: 'bold', halign: 'right', cellWidth: 22 },
        3: { halign: 'right', cellWidth: 18 },
        4: { fontStyle: 'bold', halign: 'center', cellWidth: 24 },
        5: { cellWidth: 88 },
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 4;

    // Monthly Climatology Table
    const monthRows = MONTHLY_CLIMATOLOGY.map(m => [
      m.monthName,
      `${m.avgMonthlyRainfallMm} mm`,
      `${m.avgTempC} °C`,
      `${m.historicalMaxRainMm} mm`,
      m.avgMonthlyRainfallMm > 150 ? 'PEAK MONSOON' : m.avgMonthlyRainfallMm > 50 ? 'INTERMEDIATE' : 'DRY SEASON'
    ]);

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Month', 'Avg Monthly Precipitation', 'Average Temperature', 'Record Max Rain', 'Monsoon Classification']],
      body: monthRows,
      theme: 'grid',
      headStyles: {
        fillColor: [36, 43, 45],
        textColor: [195, 245, 255],
        fontStyle: 'bold',
        fontSize: 7.5,
      },
      bodyStyles: {
        fontSize: 7,
        textColor: [30, 41, 59],
        cellPadding: 1.8,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 30 },
        1: { halign: 'right', cellWidth: 38 },
        2: { halign: 'right', cellWidth: 34 },
        3: { fontStyle: 'bold', halign: 'right', cellWidth: 34 },
        4: { fontStyle: 'bold', halign: 'center', cellWidth: 50 },
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 2;
  }

  // -------------------------------------------------------------
  // SECTION 5: EMERGENCY RESPONSE FLEET & UNITS
  // -------------------------------------------------------------
  if (includeResponseUnits) {
    addSectionHeader('5. Emergency Response Fleet & Asset Deployment', `${units.length} UNITS TRACKED`);

    const unitRows = units.map(u => [
      u.id,
      u.name,
      u.type.replace(/_/g, ' '),
      `${u.personnel} Personnel`,
      u.status,
      u.assignedIncidentId || 'Standby Ready',
      u.etaMinutes ? `${u.etaMinutes} min` : 'On Station',
    ]);

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Unit ID', 'Callsign & Unit Name', 'Equipment Type', 'Crew Size', 'Deployment Status', 'Assigned Mission', 'ETA']],
      body: unitRows,
      theme: 'grid',
      headStyles: {
        fillColor: [19, 29, 30],
        textColor: [0, 229, 255],
        fontStyle: 'bold',
        fontSize: 7.5,
      },
      bodyStyles: {
        fontSize: 7,
        textColor: [30, 41, 59],
        cellPadding: 2,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 22 },
        1: { fontStyle: 'bold', cellWidth: 50 },
        2: { cellWidth: 32 },
        3: { halign: 'right', cellWidth: 22 },
        4: { fontStyle: 'bold', halign: 'center', cellWidth: 26 },
        5: { cellWidth: 20 },
        6: { halign: 'right', cellWidth: 14 },
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 2;
  }

  // -------------------------------------------------------------
  // SECTION 6: URBAN DEVELOPMENT & POWER GRID VULNERABILITY
  // -------------------------------------------------------------
  if (includePowerGrid) {
    addSectionHeader('6. Urban Development & Power Substation Flood Vulnerability', '8 MUNICIPAL ZONES');

    const zoneRows = DELHI_URBAN_DEVELOPMENT_ZONES.map(z => [
      z.zoneName,
      z.developmentCategory,
      `${z.highDevPct}%`,
      `${z.peakLoadMW} MW`,
      `${z.stormDrainCapacityMW} MW`,
      z.floodVulnerability,
    ]);

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Urban Zone Name', 'Density', 'High Dev Area', 'Peak Grid Load', 'Pumping Drain Load', 'Hydrological Vulnerability Factor']],
      body: zoneRows,
      theme: 'grid',
      headStyles: {
        fillColor: [19, 29, 30],
        textColor: [0, 229, 255],
        fontStyle: 'bold',
        fontSize: 7.5,
      },
      bodyStyles: {
        fontSize: 7,
        textColor: [30, 41, 59],
        cellPadding: 2,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 44 },
        1: { halign: 'center', cellWidth: 18 },
        2: { halign: 'right', cellWidth: 22 },
        3: { halign: 'right', cellWidth: 24 },
        4: { halign: 'right', cellWidth: 26 },
        5: { cellWidth: 52 },
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 2;
  }

  // -------------------------------------------------------------
  // SECTION 7: CRITICAL INFRASTRUCTURE & EVACUATION ROUTES
  // -------------------------------------------------------------
  if (includeCriticalInfra || includeEvacuationRoutes) {
    addSectionHeader('7. Critical Infrastructure & Smart Evacuation Corridors', 'CIVIL DEFENSE MATRIX');

    if (includeCriticalInfra) {
      const infraRows = CRITICAL_INFRASTRUCTURE.map(inf => [
        inf.name,
        inf.type.replace(/_/g, ' '),
        inf.status,
        `${inf.barrierHeightM} m`,
        inf.criticality,
      ]);

      autoTable(doc, {
        startY: currentY,
        margin: { left: margin, right: margin },
        head: [['Asset / Facility Name', 'Category', 'Flood Defended Status', 'Flood Wall Height', 'Criticality']],
        body: infraRows,
        theme: 'grid',
        headStyles: {
          fillColor: [19, 29, 30],
          textColor: [0, 229, 255],
          fontStyle: 'bold',
          fontSize: 7.5,
        },
        bodyStyles: {
          fontSize: 7,
          textColor: [30, 41, 59],
          cellPadding: 2,
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 58 },
          1: { cellWidth: 38 },
          2: { fontStyle: 'bold', halign: 'center', cellWidth: 34 },
          3: { halign: 'right', cellWidth: 26 },
          4: { fontStyle: 'bold', halign: 'center', cellWidth: 30 },
        },
      });

      currentY = (doc as any).lastAutoTable.finalY + 4;
    }

    if (includeEvacuationRoutes) {
      const routeRows = SMART_EVACUATION_ROUTES.map(r => [
        r.name,
        r.origin,
        r.destination,
        r.status,
        `${r.capacityVehiclesPerHour.toLocaleString()} veh/hr`,
      ]);

      autoTable(doc, {
        startY: currentY,
        margin: { left: margin, right: margin },
        head: [['Corridor Route', 'Origin Zone', 'Safe Destination Hub', 'Traffic Status', 'Evacuation Capacity']],
        body: routeRows,
        theme: 'grid',
        headStyles: {
          fillColor: [36, 43, 45],
          textColor: [195, 245, 255],
          fontStyle: 'bold',
          fontSize: 7.5,
        },
        bodyStyles: {
          fontSize: 7,
          textColor: [30, 41, 59],
          cellPadding: 2,
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 54 },
          1: { cellWidth: 34 },
          2: { cellWidth: 44 },
          3: { fontStyle: 'bold', halign: 'center', cellWidth: 24 },
          4: { halign: 'right', cellWidth: 30 },
        },
      });

      currentY = (doc as any).lastAutoTable.finalY + 2;
    }
  }

  // -------------------------------------------------------------
  // FOOTER & PAGE NUMBERING (ALL PAGES)
  // -------------------------------------------------------------
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Bottom separator
    doc.setDrawColor(59, 73, 76);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);

    // Footer Text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(132, 147, 150);
    doc.text('AquaG GIS 4.2 • Municipal Flood Intelligence Platform • Confidential Emergency Operations Document', margin, pageHeight - 6);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 168, 190);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 6, { align: 'right' });
  }

  return doc;
};

export const downloadPdfReport = (
  incidents: IncidentAlert[],
  pumps: PumpStation[],
  sensors: SensorTelemetry[],
  units: ResponseUnit[],
  timelineFrames: TimelineFrame[],
  options: PdfExportOptions = {}
): void => {
  const doc = generateComprehensivePdfReport(
    incidents,
    pumps,
    sensors,
    units,
    timelineFrames,
    options
  );

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
  const fileName = `AquaG_Flood_Intelligence_Report_${timestamp}.pdf`;
  doc.save(fileName);
};
