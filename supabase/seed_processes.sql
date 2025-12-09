-- Seed data for standard processes library
-- Run this after the migration to populate the process library

INSERT INTO standard_processes (code, name, description, category, icon, display_order, content) VALUES

-- ISOLATION PROCESSES
('LOTO', 'Lock Out Tag Out (LOTO)', 'Electrical isolation and safe isolation procedures', 'Isolation', 'Lock', 1,
'{
  "summary": "Lock Out Tag Out procedure for safe electrical isolation",
  "steps": [
    "Identify all energy sources to be isolated",
    "Notify affected personnel of planned isolation",
    "Shut down equipment using normal operating controls",
    "Isolate all energy sources using isolation devices",
    "Apply personal locks and tags to isolation points",
    "Release stored energy (capacitors, springs, pressure)",
    "Verify isolation using approved test equipment",
    "Perform work only after confirming dead",
    "Remove locks/tags only by the person who applied them",
    "Restore equipment and notify personnel before energizing"
  ],
  "hazards": [
    {"name": "Electric shock", "severity": 5, "likelihood": 3},
    {"name": "Arc flash", "severity": 5, "likelihood": 2},
    {"name": "Stored energy release", "severity": 4, "likelihood": 2},
    {"name": "Unexpected energization", "severity": 5, "likelihood": 2}
  ],
  "controls": [
    "Use approved LOTO devices and padlocks",
    "One lock per person working on the system",
    "Test for dead before touching conductors",
    "Use voltage indicators rated for system voltage",
    "Prove test equipment before and after use",
    "Maintain safe approach distances until proven dead"
  ],
  "ppe": ["Safety glasses", "Insulated gloves (class appropriate)", "Arc flash suit (if required)", "Safety boots"],
  "training": ["Electrical safety awareness", "LOTO procedure training", "Authorised Person certification"],
  "legislation": ["Electricity at Work Regulations 1989", "HSG85"]
}'::jsonb),

('SAFE_ISOLATION', 'Safe Isolation Procedure', 'General safe isolation for electrical systems', 'Isolation', 'Power', 2,
'{
  "summary": "Safe isolation procedure for working on electrical circuits",
  "steps": [
    "Identify circuit to be isolated",
    "Check circuit diagrams and labelling",
    "Isolate at appropriate point (DB, isolator, etc.)",
    "Secure isolation with lock-off device",
    "Prove voltage tester on known live source",
    "Test for dead at point of work",
    "Prove voltage tester again",
    "Apply additional locks if required",
    "Complete work",
    "Remove all tools and materials before re-energizing"
  ],
  "hazards": [
    {"name": "Electric shock", "severity": 5, "likelihood": 2},
    {"name": "Incorrect circuit isolated", "severity": 5, "likelihood": 2}
  ],
  "controls": [
    "Use approved voltage indicators",
    "Prove-test-prove methodology",
    "Lock-off devices on all isolation points",
    "Clear labelling of isolated circuits"
  ],
  "ppe": ["Safety glasses", "Insulated gloves", "Safety boots"],
  "training": ["Electrical safety awareness", "Safe isolation training"],
  "legislation": ["Electricity at Work Regulations 1989"]
}'::jsonb),

-- PERMIT TO WORK
('PTW_GENERAL', 'Permit to Work (General)', 'General permit to work procedures', 'Permits', 'ClipboardCheck', 10,
'{
  "summary": "General permit to work procedure for high-risk activities",
  "steps": [
    "Identify the work and associated hazards",
    "Complete risk assessment for the task",
    "Apply for permit from permit issuer",
    "Attend permit briefing",
    "Check all precautions are in place",
    "Sign on to permit",
    "Carry out work within permit conditions",
    "Report any changes or incidents",
    "Sign off permit on completion",
    "Hand back permit to issuer"
  ],
  "hazards": [
    {"name": "Work outside permit conditions", "severity": 4, "likelihood": 2},
    {"name": "Inadequate precautions", "severity": 4, "likelihood": 2}
  ],
  "controls": [
    "Valid permit displayed at work location",
    "All workers briefed on permit conditions",
    "Regular monitoring during work",
    "Clear communication with permit issuer"
  ],
  "ppe": ["As specified in permit"],
  "training": ["Permit to work procedures", "Site induction"],
  "legislation": ["Health and Safety at Work Act 1974"]
}'::jsonb),

('HOT_WORKS', 'Hot Works Permit', 'Welding, cutting, grinding and other ignition sources', 'Permits', 'Flame', 11,
'{
  "summary": "Hot works permit procedure for welding, cutting, and grinding",
  "steps": [
    "Complete hot works permit application",
    "Clear area of combustible materials (minimum 10m)",
    "Cover immovable combustibles with fire blankets",
    "Check for flammable atmospheres",
    "Position fire extinguisher within reach",
    "Ensure adequate ventilation",
    "Set up welding screens to protect others",
    "Complete work",
    "Conduct fire watch for minimum 60 minutes after completion",
    "Sign off permit"
  ],
  "hazards": [
    {"name": "Fire/explosion", "severity": 5, "likelihood": 3},
    {"name": "Burns", "severity": 3, "likelihood": 3},
    {"name": "Fume inhalation", "severity": 3, "likelihood": 3},
    {"name": "UV radiation (arc eye)", "severity": 3, "likelihood": 3}
  ],
  "controls": [
    "Hot works permit in place",
    "Fire extinguisher immediately available",
    "Fire blankets covering combustibles",
    "Welding screens in position",
    "Fire watch during and after work"
  ],
  "ppe": ["Welding helmet/goggles", "Fire-resistant clothing", "Welding gauntlets", "Safety boots", "Respiratory protection (if required)"],
  "training": ["Hot works safety", "Fire extinguisher use", "Welding/cutting competency"],
  "legislation": ["DSEAR 2002", "Regulatory Reform (Fire Safety) Order 2005"]
}'::jsonb),

('CONFINED_SPACE', 'Confined Space Entry', 'Entry into confined spaces', 'Permits', 'Box', 12,
'{
  "summary": "Safe entry into confined spaces with atmospheric hazards",
  "steps": [
    "Obtain confined space entry permit",
    "Appoint competent supervisor and standby person",
    "Test atmosphere before entry (O2, LEL, toxics)",
    "Purge/ventilate if required",
    "Set up rescue equipment and communications",
    "Brief all personnel on emergency procedures",
    "Enter wearing PPE and with continuous monitoring",
    "Maintain communication with standby person",
    "Re-test atmosphere if work is interrupted",
    "Exit immediately if alarm sounds"
  ],
  "hazards": [
    {"name": "Oxygen deficiency", "severity": 5, "likelihood": 3},
    {"name": "Toxic atmosphere", "severity": 5, "likelihood": 3},
    {"name": "Flammable atmosphere", "severity": 5, "likelihood": 2},
    {"name": "Engulfment", "severity": 5, "likelihood": 2}
  ],
  "controls": [
    "Atmospheric testing before and during entry",
    "Forced ventilation if required",
    "Continuous gas monitoring",
    "Trained standby person at entry point",
    "Emergency rescue plan and equipment ready"
  ],
  "ppe": ["Gas detector", "Harness and lifeline", "Respiratory protection", "Hard hat", "Safety boots"],
  "training": ["Confined space entry", "Gas detection equipment", "Emergency rescue"],
  "legislation": ["Confined Spaces Regulations 1997", "ACOP L101"]
}'::jsonb),

('EXCAVATION', 'Excavation Permit', 'Safe excavation and trenching work', 'Permits', 'Shovel', 13,
'{
  "summary": "Safe excavation procedures including service avoidance",
  "steps": [
    "Obtain excavation permit",
    "Check service records and CAT scan area",
    "Mark up underground services",
    "Set up barriers and signage",
    "Hand dig within 500mm of services",
    "Install shoring/battering as required",
    "Provide safe access (ladder/steps)",
    "Keep spoil away from edge (minimum 1m)",
    "Inspect daily and after weather events",
    "Backfill safely on completion"
  ],
  "hazards": [
    {"name": "Collapse/cave-in", "severity": 5, "likelihood": 3},
    {"name": "Striking underground services", "severity": 5, "likelihood": 3},
    {"name": "Falls into excavation", "severity": 4, "likelihood": 3},
    {"name": "Flooding", "severity": 3, "likelihood": 2}
  ],
  "controls": [
    "CAT and Genny scanning before digging",
    "Trial holes to confirm service locations",
    "Shoring/battering to prevent collapse",
    "Edge protection and barriers",
    "Safe access and egress"
  ],
  "ppe": ["Hard hat", "High-visibility clothing", "Safety boots", "Gloves"],
  "training": ["Excavation safety", "CAT and Genny operation", "Service identification"],
  "legislation": ["CDM 2015", "HSG47 - Avoiding danger from underground services"]
}'::jsonb),

-- WORKING AT HEIGHT
('WORKING_AT_HEIGHT', 'Working at Height', 'Safe working at height procedures', 'General', 'ArrowUp', 20,
'{
  "summary": "Safe working at height including access equipment selection",
  "steps": [
    "Assess if work at height can be avoided",
    "Select appropriate access equipment for task",
    "Inspect equipment before use",
    "Ensure competent person erects scaffolding",
    "Check scaffold tag is valid (green)",
    "Secure tools and materials against falling",
    "Use collective protection over personal protection",
    "Wear harness if required and anchor correctly",
    "Never overreach - move access equipment",
    "Report any defects immediately"
  ],
  "hazards": [
    {"name": "Falls from height", "severity": 5, "likelihood": 3},
    {"name": "Falling objects", "severity": 4, "likelihood": 3},
    {"name": "Equipment collapse", "severity": 5, "likelihood": 2}
  ],
  "controls": [
    "Edge protection on all open edges",
    "Toe boards to prevent materials falling",
    "Tool lanyards for hand tools",
    "Exclusion zone below work area",
    "Harness and fall arrest where required"
  ],
  "ppe": ["Hard hat", "Safety harness (where required)", "Safety boots", "Tool lanyard"],
  "training": ["Working at height awareness", "Harness inspection and use", "Ladder/platform safety"],
  "legislation": ["Work at Height Regulations 2005", "HSE INDG401"]
}'::jsonb),

('LADDERS', 'Ladder Safety', 'Safe use of ladders and stepladders', 'General', 'ArrowUp', 21,
'{
  "summary": "Safe ladder use including inspection and positioning",
  "steps": [
    "Assess if ladder is appropriate for the task",
    "Select correct type and length of ladder",
    "Inspect ladder before each use",
    "Position on firm, level ground",
    "Secure ladder at top or bottom",
    "Maintain 3 points of contact when climbing",
    "Do not overreach - keep belt buckle within stiles",
    "Face ladder when ascending/descending",
    "Do not carry heavy/bulky items up ladder",
    "Store ladders safely after use"
  ],
  "hazards": [
    {"name": "Falls from ladder", "severity": 4, "likelihood": 3},
    {"name": "Ladder slipping", "severity": 4, "likelihood": 3},
    {"name": "Overreaching", "severity": 4, "likelihood": 3}
  ],
  "controls": [
    "1:4 ratio for leaning ladders",
    "Ladder secured or footed",
    "3 rungs above landing point",
    "Pre-use inspection",
    "Short duration use only"
  ],
  "ppe": ["Safety boots", "Hard hat (if overhead hazards)"],
  "training": ["Ladder safety training"],
  "legislation": ["Work at Height Regulations 2005"]
}'::jsonb),

-- GENERAL SAFETY
('MANUAL_HANDLING', 'Manual Handling', 'Safe lifting and carrying techniques', 'General', 'Package', 30,
'{
  "summary": "Safe manual handling techniques and controls",
  "steps": [
    "Assess the load - weight, size, grip points",
    "Plan the lift - route, obstacles, destination",
    "Get help or use mechanical aid if needed",
    "Stand close to load with feet apart",
    "Bend knees, keep back straight",
    "Get firm grip and lift smoothly",
    "Keep load close to body",
    "Avoid twisting - move feet instead",
    "Set down carefully, reversing the process",
    "Report any injuries or near misses"
  ],
  "hazards": [
    {"name": "Back injury", "severity": 3, "likelihood": 4},
    {"name": "Crush injuries", "severity": 4, "likelihood": 2},
    {"name": "Cuts from sharp edges", "severity": 2, "likelihood": 3}
  ],
  "controls": [
    "Use mechanical aids where possible",
    "Team lifts for heavy items",
    "Break down loads where possible",
    "Clear access routes",
    "Training in correct techniques"
  ],
  "ppe": ["Safety boots", "Gloves", "Back support belt (optional)"],
  "training": ["Manual handling training"],
  "legislation": ["Manual Handling Operations Regulations 1992"]
}'::jsonb),

('COSHH', 'COSHH - Hazardous Substances', 'Control of substances hazardous to health', 'General', 'AlertTriangle', 31,
'{
  "summary": "Safe handling and use of hazardous substances",
  "steps": [
    "Identify hazardous substances in use",
    "Obtain and read Safety Data Sheets (SDS)",
    "Complete COSHH assessment",
    "Substitute with less hazardous alternatives where possible",
    "Use engineering controls (LEV, enclosure)",
    "Ensure adequate ventilation",
    "Wear required PPE",
    "Follow safe handling procedures",
    "Store substances correctly",
    "Dispose of waste safely"
  ],
  "hazards": [
    {"name": "Inhalation of fumes/vapours", "severity": 4, "likelihood": 3},
    {"name": "Skin contact/absorption", "severity": 3, "likelihood": 3},
    {"name": "Eye contact", "severity": 4, "likelihood": 2},
    {"name": "Fire/explosion", "severity": 5, "likelihood": 2}
  ],
  "controls": [
    "COSHH assessment available",
    "SDS at point of use",
    "Correct PPE provided",
    "Local exhaust ventilation",
    "Correct storage and disposal"
  ],
  "ppe": ["As specified in COSHH assessment/SDS"],
  "training": ["COSHH awareness", "SDS interpretation", "PPE use"],
  "legislation": ["COSHH Regulations 2002", "EH40 Workplace Exposure Limits"]
}'::jsonb),

('ASBESTOS', 'Asbestos Awareness', 'Asbestos identification and reporting', 'General', 'AlertOctagon', 32,
'{
  "summary": "Asbestos awareness - identification and safe response",
  "steps": [
    "Check asbestos register/survey before work",
    "Know where ACMs are located in the building",
    "Do not disturb suspected ACMs",
    "Stop work if unexpected material found",
    "Isolate the area",
    "Report to supervisor immediately",
    "Do not attempt to clean up",
    "Leave area and wash hands/face",
    "Wait for specialist assessment",
    "Record incident"
  ],
  "hazards": [
    {"name": "Asbestos fibre inhalation", "severity": 5, "likelihood": 2},
    {"name": "Asbestos-related disease (mesothelioma, lung cancer)", "severity": 5, "likelihood": 2}
  ],
  "controls": [
    "Check asbestos register before work",
    "Asbestos awareness training for all workers",
    "Stop work if ACMs suspected",
    "Licensed contractor for ACM removal",
    "Air monitoring where required"
  ],
  "ppe": ["RPE (FFP3) if ACM disturbance possible", "Disposable coveralls"],
  "training": ["Asbestos awareness training (mandatory)"],
  "legislation": ["Control of Asbestos Regulations 2012", "HSG264 - Asbestos: The Survey Guide"]
}'::jsonb),

('FIRST_AID', 'First Aid Response', 'Emergency first aid procedures', 'Emergency', 'Heart', 40,
'{
  "summary": "First aid response and emergency procedures",
  "steps": [
    "Assess the scene for danger",
    "Call for help - alert first aiders",
    "Do not move casualty unless in danger",
    "Check responsiveness - AVPU scale",
    "Call emergency services if required (999)",
    "Check airway, breathing, circulation",
    "Control any bleeding",
    "Treat for shock if needed",
    "Stay with casualty until help arrives",
    "Complete accident report form"
  ],
  "hazards": [
    {"name": "Secondary injury to rescuer", "severity": 3, "likelihood": 2},
    {"name": "Infection from blood/bodily fluids", "severity": 3, "likelihood": 2}
  ],
  "controls": [
    "First aiders identified and trained",
    "First aid kits stocked and accessible",
    "Emergency contacts displayed",
    "Clear access for emergency services",
    "Regular first aid drills"
  ],
  "ppe": ["Disposable gloves", "Face shield (for CPR)"],
  "training": ["First aid at work", "Emergency first aid", "AED training"],
  "legislation": ["Health and Safety (First Aid) Regulations 1981"]
}'::jsonb),

('FIRE_SAFETY', 'Fire Safety', 'Fire prevention and evacuation', 'Emergency', 'Flame', 41,
'{
  "summary": "Fire prevention, response and evacuation procedures",
  "steps": [
    "Know the fire evacuation plan",
    "Know location of fire exits and assembly points",
    "Know location of fire extinguishers",
    "Keep fire routes clear at all times",
    "Report fire hazards immediately",
    "On discovering fire - raise alarm",
    "If safe, attempt to extinguish small fires",
    "Evacuate via nearest safe route",
    "Do not use lifts",
    "Report to assembly point and do not re-enter"
  ],
  "hazards": [
    {"name": "Burns", "severity": 5, "likelihood": 2},
    {"name": "Smoke inhalation", "severity": 5, "likelihood": 2},
    {"name": "Crush injuries in evacuation", "severity": 3, "likelihood": 2}
  ],
  "controls": [
    "Fire risk assessment in place",
    "Fire detection and alarm systems",
    "Appropriate fire extinguishers",
    "Clear fire escape routes",
    "Regular fire drills"
  ],
  "ppe": ["None specific - follow evacuation procedures"],
  "training": ["Fire safety awareness", "Fire warden training", "Fire extinguisher training"],
  "legislation": ["Regulatory Reform (Fire Safety) Order 2005"]
}'::jsonb)

ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  content = EXCLUDED.content,
  icon = EXCLUDED.icon,
  display_order = EXCLUDED.display_order,
  updated_at = now();
