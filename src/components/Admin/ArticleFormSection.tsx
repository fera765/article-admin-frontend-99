
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ArticleFormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const ArticleFormSection: React.FC<ArticleFormSectionProps> = ({
  title,
  children,
  className = ''
}) => {
  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
};

export default ArticleFormSection;
