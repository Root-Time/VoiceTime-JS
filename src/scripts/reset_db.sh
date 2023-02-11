#!/usr/bin/bash

rm /home/time/Code/slumpy/src/data.db

npx prisma db push
