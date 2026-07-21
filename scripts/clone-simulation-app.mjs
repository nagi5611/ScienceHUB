#!/usr/bin/env node
/**
 * 3D印刷予約アプリをシミュレーション依頼・管理アプリへクローンする。
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

const COPY_PAIRS = [
  ['functions/lib/3dprint', 'functions/lib/simulation'],
  ['functions/api/3dprint', 'functions/api/simulation'],
  ['public/apps/3dprint-reservation', 'public/apps/simulation-request'],
  ['public/apps/3dprint-management', 'public/apps/simulation-management'],
  ['public/css/apps/3dprint-reservation.css', 'public/css/apps/simulation-request.css'],
  ['public/css/apps/3dprint-management.css', 'public/css/apps/simulation-management.css'],
];

const FILE_RENAMES = [
  ['functions/lib/simulation/printers.ts', 'functions/lib/simulation/simulators.ts'],
  ['functions/lib/simulation/printer-availability.ts', 'functions/lib/simulation/simulator-availability.ts'],
  ['functions/lib/simulation/printer-capabilities.ts', 'functions/lib/simulation/simulator-capabilities.ts'],
  ['functions/lib/simulation/printer-daily-capacity.ts', 'functions/lib/simulation/simulator-daily-capacity.ts'],
  ['functions/lib/simulation/printer-image.ts', 'functions/lib/simulation/simulator-image.ts'],
  ['functions/lib/simulation/printer-shift-guard.ts', 'functions/lib/simulation/simulator-shift-guard.ts'],
  ['functions/lib/simulation/printer-status.ts', 'functions/lib/simulation/simulator-status.ts'],
  ['functions/lib/simulation/print-app-settings.ts', 'functions/lib/simulation/sim-app-settings.ts'],
  ['functions/lib/simulation/print-profile.ts', 'functions/lib/simulation/sim-profile.ts'],
  ['functions/lib/simulation/print-video.ts', 'functions/lib/simulation/result-video.ts'],
  [
    'public/apps/simulation-management/js/print-video-folder-picker.js',
    'public/apps/simulation-management/js/result-video-folder-picker.js',
  ],
];

/** Recursively copies a file or directory. */
function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

/** Walks files under a directory. */
function walkFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(full));
    else files.push(full);
  }
  return files;
}

/** Applies ordered text replacements to cloned files. */
function transformContent(content) {
  const replacements = [
    ['build3dPrintAdminUrl', 'buildSimulationAdminUrl'],
    ['3dprint-management', 'simulation-management'],
    ['3dprint-reservation', 'simulation-request'],
    ['/api/3dprint', '/api/simulation'],
    ['../../lib/3dprint/', '../../lib/simulation/'],
    ['../lib/3dprint/', '../lib/simulation/'],
    ['./3dprint/', './simulation/'],
    ['GOOGLE_3DPRINT_', 'GOOGLE_SIMULATION_'],
    ['app_3dprint_management', 'app_simulation_management'],
    ['app_3dprint_reservation', 'app_simulation_request'],
    ['print_printer_availability', 'sim_simulator_availability'],
    ['print_member_availability', 'sim_member_availability'],
    ['print_upload_sessions', 'sim_upload_sessions'],
    ['print_reservations', 'sim_reservations'],
    ['print_app_settings', 'sim_app_settings'],
    ['print_printers', 'sim_simulators'],
    ['print_members', 'sim_members'],
    ['print_staff_member_id', 'sim_staff_member_id'],
    ['request_print_video', 'request_result_video'],
    ['print_video_storage_path', 'result_video_storage_path'],
    ['print_video_filename', 'result_video_filename'],
    ['print_video_size_bytes', 'result_video_size_bytes'],
    ['print-video-folder', 'result-video-folder'],
    ['print-video', 'result-video'],
    ['print_staff', 'sim_staff'],
    ['print_notes', 'sim_notes'],
    ['print_scale', 'sim_scale'],
    ['printer_id', 'simulator_id'],
    ['printers/', 'simulators/'],
    ['admin/printers', 'admin/simulators'],
    ['admin/shifts/printer-', 'admin/shifts/simulator-'],
    ['shift-printer', 'shift-simulator'],
    ['PrinterShift', 'SimulatorShift'],
    ['printerShift', 'simulatorShift'],
    ['PrinterAvailability', 'SimulatorAvailability'],
    ['printerAvailability', 'simulatorAvailability'],
    ['PrinterCapabilities', 'SimulatorCapabilities'],
    ['printerCapabilities', 'simulatorCapabilities'],
    ['PrinterStatus', 'SimulatorStatus'],
    ['printerStatus', 'simulatorStatus'],
    ['PrinterDaily', 'SimulatorDaily'],
    ['printerDaily', 'simulatorDaily'],
    ['PrinterImage', 'SimulatorImage'],
    ['printerImage', 'simulatorImage'],
    ['getAllPrinters', 'getAllSimulators'],
    ['getPrinterById', 'getSimulatorById'],
    ['createPrinter', 'createSimulator'],
    ['deletePrinter', 'deleteSimulator'],
    ['updatePrinter', 'updateSimulator'],
    ['formatPrinterForApi', 'formatSimulatorForApi'],
    ['countReservationsByPrinterId', 'countReservationsBySimulatorId'],
    ['getAppliedReservationCountsByPrinter', 'getAppliedReservationCountsBySimulator'],
    ['getReservationsByDateAndPrinter', 'getReservationsByDateAndSimulator'],
    ['checkPrinterShiftRemovalBlocked', 'checkSimulatorShiftRemovalBlocked'],
    ['validatePrinterCapabilitiesInput', 'validateSimulatorCapabilitiesInput'],
    ['parsePrinterCapabilities', 'parseSimulatorCapabilities'],
    ['validatePrinterStatusInput', 'validateSimulatorStatusInput'],
    ['validatePrinterDailyCapacityInput', 'validateSimulatorDailyCapacityInput'],
    ['parsePrinterDailyCapacity', 'parseSimulatorDailyCapacity'],
    ['streamPrintFile', 'streamSimFile'],
    ['copyPrintFile', 'copySimFile'],
    ['uploadPrintFile', 'uploadSimFile'],
    ['getPrintUserProfile', 'getSimUserProfile'],
    ['isPrintProfileComplete', 'isSimProfileComplete'],
    ['PRINT_SCALE_WEIGHT', 'SIM_SCALE_WEIGHT'],
    ['PrintScale', 'SimScale'],
    ["'printing'", "'running'"],
    ['"printing"', '"running"'],
    ['3dprint/', 'simulation/'],
    ['3D印刷予約', 'シミュレーション依頼'],
    ['3D印刷管理', 'シミュレーション管理'],
    ['3D印刷', 'シミュレーション'],
    ['印刷予約', 'シミュレーション依頼'],
    ['希望印刷日', '希望実施日'],
    ['印刷希望日', '希望実施日'],
    ['印刷日', '実施日'],
    ['印刷中', '実行中'],
    ['印刷動画', '結果動画'],
    ['印刷ファイル', 'データファイル'],
    ['印刷担当', '実行担当'],
    ['プリンター', 'シミュレーター'],
    ['print-app-settings', 'sim-app-settings'],
    ['print-profile', 'sim-profile'],
    ['print-video', 'result-video'],
    ['print_printer', 'sim_simulator'],
    ['from \'./printers\'', 'from \'./simulators\''],
    ['from "./printers"', 'from "./simulators"'],
    ['from \'./printer-', 'from \'./simulator-'],
    ['from "./printer-', 'from "./simulator-'],
    ['from \'./print-app-settings\'', 'from \'./sim-app-settings\''],
    ['from "./print-app-settings"', 'from "./sim-app-settings"'],
    ['from \'./print-profile\'', 'from \'./sim-profile\''],
    ['from "./print-profile"', 'from "./sim-profile"'],
    ['from \'./print-video\'', 'from \'./result-video\''],
    ['from "./print-video"', 'from "./result-video"'],
    ['printPrinters', 'simSimulators'],
    ['allPrinters', 'allSimulators'],
    ['shiftPrinters', 'shiftSimulators'],
    ['selectedPrinterId', 'selectedSimulatorId'],
    ['pendingPrinterShiftRemoval', 'pendingSimulatorShiftRemoval'],
    ['printer-toggle', 'simulator-toggle'],
    ['printersData', 'simulatorsData'],
    ['printers:', 'simulators:'],
    [' printers ', ' simulators '],
    ['(printers)', '(simulators)'],
    ['printer.', 'simulator.'],
    ['Printer', 'Simulator'],
    ['printer', 'simulator'],
    ['MANAGEMENT_APP = "simulation-management"', 'MANAGEMENT_APP = "simulation-management"'],
    ['RESERVATION_APP = "simulation-request"', 'RESERVATION_APP = "simulation-request"'],
    ['3dprint-reservation.css', 'simulation-request.css'],
    ['3dprint-management.css', 'simulation-management.css'],
    ['print-video-folder-picker.js', 'result-video-folder-picker.js'],
    ['isSimProfileComplete', 'isSimProfileComplete'],
    ['getSimUserProfile', 'getSimUserProfile'],
  ];

  let next = content;
  for (const [from, to] of replacements) {
    next = next.split(from).join(to);
  }
  return next;
}

for (const [srcRel, destRel] of COPY_PAIRS) {
  const src = path.join(root, srcRel);
  const dest = path.join(root, destRel);
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }
  copyRecursive(src, dest);
}

for (const [fromRel, toRel] of FILE_RENAMES) {
  const from = path.join(root, fromRel);
  const to = path.join(root, toRel);
  if (!fs.existsSync(from)) continue;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.renameSync(from, to);
}

const targetRoots = [
  path.join(root, 'functions/lib/simulation'),
  path.join(root, 'functions/api/simulation'),
  path.join(root, 'public/apps/simulation-request'),
  path.join(root, 'public/apps/simulation-management'),
  path.join(root, 'public/css/apps/simulation-request.css'),
  path.join(root, 'public/css/apps/simulation-management.css'),
];

for (const targetRoot of targetRoots) {
  const files = fs.statSync(targetRoot).isDirectory() ? walkFiles(targetRoot) : [targetRoot];
  for (const file of files) {
    if (!/\.(ts|js|html|css)$/.test(file)) continue;
    const original = fs.readFileSync(file, 'utf8');
    const transformed = transformContent(original);
    fs.writeFileSync(file, transformed);
  }
}

console.log('Simulation app clone complete.');
