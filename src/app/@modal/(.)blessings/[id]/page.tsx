import BlessingModal from '@/components/BlessingModal';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function InterceptedBlessingPage({ params }: PageProps) {
  const { id } = await params;
  return <BlessingModal id={id} />;
}