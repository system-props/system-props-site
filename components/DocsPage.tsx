import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { docsRoutes, allDocsRoutes } from '../lib/docsRoutes';
import { HamburgerMenuIcon } from '@modulz/radix-icons';
import { ExternalIcon } from './ExternalIcon';
import { Box } from './Box';
import { Text } from './Text';
import { IconButton } from './IconButton';
import { ThemeToggle } from './ThemeToggle';

const GITHUB_URL = 'https://github.com';
const REPO_NAME = 'system-props/system-props-site';

export function DocsPage({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const currentPath = router.pathname.replace(
    '[slug]',
    router.query.slug as string
  );
  const currentPageId = currentPath.substr(1);
  const currentPageIndex = allDocsRoutes.findIndex(
    (page) => page.slug === currentPageId
  );

  const previous = allDocsRoutes[currentPageIndex - 1];
  const next = allDocsRoutes[currentPageIndex + 1];

  const editUrl = `${GITHUB_URL}/${REPO_NAME}/edit/main${currentPath}.mdx`;

  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, []);

  return (
    <Box display="flex" flexDirection={{ all: 'column', bp2: 'row' }}>
      <Box
        width={{ all: '100%', bp2: '250px' }}
        maxHeight="auto"
        borderBottom={{ all: '2px solid $gray100', bp2: '0' }}
        borderRight={{ all: null, bp2: '2px solid $gray100' }}
        overflowX="hidden"
        position={{ all: null, bp2: 'fixed' }}
        top={{ all: null, bp2: 0 }}
        left={{ all: null, bp2: 0 }}
        bottom={{ all: null, bp2: 0 }}
        sx={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <Box display="flex" alignItems="center" p="$4">
          <NextLink href="/" passHref>
            <Box
              as="a"
              textDecoration="none"
              color="$hiContrast"
              display="inline-flex"
              fontSize="33px"
            >
              <span
                style={{
                  position: 'absolute',
                  width: 1,
                  height: 1,
                  padding: 0,
                  margin: -1,
                  overflow: 'hidden',
                  clip: 'rect(0, 0, 0, 0)',
                  whiteSpace: 'nowrap',
                  border: 0,
                }}
              >
                System props homepage
              </span>
              📦
            </Box>
          </NextLink>
          <Box ml="auto" display="flex" alignItems="center">
            <Box mr="$3" display={{ all: null, bp2: 'none' }}>
              <IconButton onClick={() => setIsOpen(!isOpen)} isActive={isOpen}>
                <HamburgerMenuIcon />
              </IconButton>
            </Box>
            <ThemeToggle />
          </Box>
        </Box>

        <Box display={{ all: isOpen ? 'block' : 'none', bp2: 'block' }}>
          {docsRoutes.map((section) => (
            <Box key={section.label} mb="$4">
              <NavHeading>{section.label}</NavHeading>
              {section.pages.map((page) => (
                <NavItem
                  key={page.slug}
                  href={`/${page.slug}`}
                  active={router.pathname === `/${page.slug}`}
                >
                  <Text fontSize="$1" color="inherit" lineHeight="1">
                    {page.title}
                  </Text>
                </NavItem>
              ))}
            </Box>
          ))}

          <NavHeading>Community</NavHeading>
          <NavItem href="https://github.com/roginfarrer/system-props">
            <Text fontSize="$1" color="inherit" lineHeight="1">
              GitHub
            </Text>
            <Box ml="$1" color="$gray500">
              <ExternalIcon />
            </Box>
          </NavItem>
        </Box>
      </Box>

      <Box
        as="main"
        flex="1"
        pt="$8"
        pb="$9"
        pl={{ all: null, bp2: '250px' }}
        pr={{ all: null, bp3: '250px' }}
        mx="auto"
      >
        <Box maxWidth="$3" mx={{ all: null, bp2: 'auto' }} px="$5">
          <Box as="article">{children}</Box>

          <Box>
            {(previous || next) && (
              <Box
                display="flex"
                justifyContent="space-between"
                my="$9"
                aria-label="Pagination navigation"
              >
                {previous && (
                  <Box>
                    <NextLink href={`/${previous.slug}`} passHref>
                      <Box
                        as="a"
                        aria-label={`Previous page: ${previous.title}`}
                        color="$blue500"
                        textDecoration="none"
                        alignItems="center"
                      >
                        <Box mb="$2">
                          <Text fontSize="$2" color="$gray400">
                            Previous
                          </Text>
                        </Box>
                        <Text fontSize="$4" color="inherit">
                          {previous.title}
                        </Text>
                      </Box>
                    </NextLink>
                  </Box>
                )}
                {next && (
                  <Box ml="auto">
                    <NextLink href={`/${next.slug}`} passHref>
                      <Box
                        as="a"
                        aria-label={`Previous page: ${next.title}`}
                        color="$blue500"
                        textDecoration="none"
                        textAlign="right"
                      >
                        <Box mb="$2">
                          <Text fontSize="$2" color="$gray400">
                            Next
                          </Text>
                        </Box>
                        <Text fontSize="$4" color="inherit">
                          {next.title}
                        </Text>
                      </Box>
                    </NextLink>
                  </Box>
                )}
              </Box>
            )}
          </Box>

          <Box my="$9">
            <Text
              fontSize="$2"
              color="$gray300"
              textDecoration="none"
              as="a"
              href={editUrl}
              title="Edit this page on GitHub."
              rel="noopener noreferrer"
              target="_blank"
            >
              Edit this page on GitHub.
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function NavHeading({ children }: { children: React.ReactNode }) {
  return (
    <Text as="h4" fontSize="$2" fontWeight="600" p="$2 $5">
      {children}
    </Text>
  );
}

type NavItemProps = {
  children: React.ReactNode;
  active?: boolean;
  href: string;
};

function NavItem({ children, active, href, ...props }: NavItemProps) {
  const isExternal = href.startsWith('http');

  return (
    <Box
      as={isExternal ? 'span' : NextLink}
      {...(isExternal ? {} : { href, passHref: true })}
    >
      <Box
        {...props}
        {...(isExternal ? { href, target: '_blank' } : {})}
        cursor="pointer"
        as="a"
        display="flex"
        alignItems="center"
        textDecoration="none"
        color="$hiContrast"
        py="$2"
        px="$5"
        bg={active ? '$blue100' : 'transparent'}
        userSelect="none"
        minHeight="$6"
        transition="background-color 50ms linear"
        _hover={{
          bg: active ? '$blue100' : '$blue50',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
