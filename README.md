# Coal Ordering Demo App

## Overview
A proof-of-concept coal ordering and distribution system for South African coal suppliers.

## Features
- Customer registration and login
- Coal product catalog
- Order placement system
- Internal approval workflow
- Payment processing
- Order tracking

## Architecture
- **Frontend**: React web app
- **Backend**: Node.js/Express API
- **Database**: DynamoDB (serverless, cost-effective)
- **Authentication**: AWS Cognito
- **Hosting**: AWS Amplify (frontend) + Lambda (backend)
- **Payment**: Stripe integration

## Cost Optimization
- Using AWS Free Tier where possible
- Serverless architecture (pay per use)
- DynamoDB on-demand pricing
- CloudFront for CDN

## Getting Started
1. Set up AWS resources
2. Deploy backend API
3. Deploy frontend
4. Configure authentication
5. Test the workflow

## Next Steps
- [ ] Set up AWS infrastructure
- [ ] Create basic API endpoints
- [ ] Build React frontend
- [ ] Implement authentication
- [ ] Add payment integration
