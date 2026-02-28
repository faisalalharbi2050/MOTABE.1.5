#!/bin/bash
# git-auto-commit.sh
# يقوم بإنشاء رسالة التزام تلقائية مع اليوم والتاريخ والوقت

SUMMARY="$1"
DAY=$(date +%A)
DATE=$(date +%d-%m-%Y)
TIME=$(date +%H:%M)

COMMIT_MSG="تحديثات: $SUMMARY

تاريخ التحديث: $DAY $DATE - $TIME"

git add .
git commit -m "$COMMIT_MSG"
git push
