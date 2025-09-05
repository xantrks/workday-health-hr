# AI Integration Guide

## Overview

This document provides a detailed explanation of how AI is integrated into the Workday health platform. The platform features AI capabilities to provide comprehensive health support for users.

## Integration Architecture

This application is designed to be purely frontend. Any AI integration is handled client-side, requiring the user to provide their own API keys directly within the application.

## AI Insights Feature

The AI Insights feature allows users to input their own API key for AI services. This enables personalized insights without requiring a backend server or environment variables for API key management.

## Usage Guidelines

When using the AI features:

1.  **API Key**: You must provide your own API key in the designated section.
2.  **Client-Side Processing**: All AI interactions occur directly from your browser.
3.  **Dummy Data**: Until a valid API key is provided, the application will display dummy data for AI insights.

## Conclusion

Workday health platform offers AI capabilities directly from the client-side, providing users with control over their AI service integration and eliminating the need for server-side API key management or backend infrastructure.