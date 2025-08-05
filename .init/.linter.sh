#!/bin/bash
cd /home/kavia/workspace/code-generation/expense-tracker-dashboard-127432-127442/expense_tracker_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

