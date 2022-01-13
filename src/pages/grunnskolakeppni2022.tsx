import * as React from 'react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Scoreboard from '../components/competition/bootstrap/scoreboard';
import Layout from '../components/layout/layout';
// import { ReddumTitle } from '../components/competition/ui/reddum-title';
import {
    isCompetition,
    isCompetitionOver,
} from '../utilities/competition-helper';
import CompanyList from '../components/competition/company-list';
import Link from 'next/link';
// import * as colors from '../components/competition/ui/colors';
import { useRouter } from 'next/router';
// import PrimaryButton from '../components/competition/ui/comp-button-primary';
import { Button } from '../components/ui/buttons';
import useSWR from 'swr';
import { getCompetitionScores } from '../services/competition-api';
import { ScoreboardData } from '../types/competition';
import { CompetitionStats } from '../components/competition/competition-stats';
import { theme } from '../styles/global';
import { StyledLink } from '../components/ui/links/link';
import { pages } from '../constants/paths';
import AboutCompetition from '../components/competition/about';
import { AboutReddum } from '../components/competition/reddum-about';

const CompetitionPageContainer = styled.div`
    max-width: ${({ theme }) => theme.layout.desktopWidth};
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    /* align-items: center; */
    padding: 1rem;
    margin: 0 auto;
    width: 100%;
    max-width: 50rem;
    /* min-width: 30rem; */
`;

const About = styled.div`
    max-width: ${({ theme }) => theme.layout.desktopWidth};
    margin: 1rem auto 2rem auto;
    /* text-align: center; */
`;

const BottomContent = styled.div`
    max-width: ${({ theme }) => theme.layout.desktopWidth};

    margin: 2rem 0;
`;

const SelectorContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 50rem;
    margin: 0 auto;
`;

const SelectableH2 = styled.h2`
    cursor: pointer;

    & :hover {
        color: ${({ theme }) => theme.colors.darkerBlue};
    }
`;

const TitleContainer = styled.div`
    margin: 1rem 0;
`;

const Title = styled.h2``;

const ScoreboardStatsContainer = styled.div`
    max-width: ${({ theme }) => theme.layout.desktopWidth};
    width: 100%;
    color: black; ;
`;

const CompanyListContainer = styled.div`
    display: flex;
    align-items: center;
`;

interface ButtonProps {
    color: string;
}

const CTAButton = styled.button<ButtonProps>`
    flex: 1;
    border: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 1.3rem;
    padding: 0.5rem;
    background-color: ${({ color, theme }) => theme.colors[color]};
    color: white;
    cursor: pointer;
    width: 100%;
    max-width: 20rem;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    border: 1px solid white;
    transition: color, background-color 0.1s ease-in-out;

    & :active {
        transform: translateY(2px);
    }

    & :hover {
        background-color: white;
        color: ${({ color, theme }) => theme.colors[color]};
        border: 1px solid ${({ color, theme }) => theme.colors[color]};
    }
`;

interface SelectButtonProps {
    selected?: boolean;
}

const SelectButton = styled(Button)<SelectButtonProps>`
    padding: 0.5rem;
    border-radius: 0;
    color: ${({ theme }) => theme.colors.darkerBlue};
    background-color: white;
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color, background-color 0.1s ease-in-out;

    ${({ selected, theme }) =>
        selected
            ? `
        background-color: ${theme.colors.darkerBlue};
        color: white;
        `
            : ``}

    & :active {
        transform: none;
    }

    & :hover {
        ${({ theme }) =>
            `
                background-color: ${theme.colors.darkerBlue};
                color: white;
            `}
    }
    border: 1px solid ${({ theme }) => theme.colors.darkerBlue};
`;

const SelectorButtons = styled.div`
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    text-align: left;
    width: inherit;
    margin-left: 1px;
`;

const LogoContainer = styled.div`
    max-width: 20rem;

    transition: transform 0.2s; /* Animation */

    & :hover {
        transform: scale(1.1);
    }
`;

enum CompanySizes {
    all = 'all',
    small = 'small',
    medium = 'medium',
    large = 'large',
}

const Competition: React.FunctionComponent = () => {
    const [showStats, setShowStats] = useState(false);
    const [selectedSize, setSelectedSize] = useState<CompanySizes | undefined>(
        CompanySizes.all
    );
    const { data, error } = useSWR('competition-scores', getCompetitionScores);
    const [filteredData, setFilteredData] = useState<
        ScoreboardData[] | undefined
    >(undefined);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    const router = useRouter();

    const onSelectorClick = (size: CompanySizes) => {
        setSelectedSize(size);
        filterData(size);
        setShowStats(false);
    };

    const filterData = (size: CompanySizes) => {
        if (data == undefined) {
            return;
        }
        if (size == CompanySizes.all) {
            setFilteredData(data);
            return;
        }
        const filtered = data.filter((e) => e.size == size);
        const reRanked = filtered.map((e, index) => {
            const reRank: ScoreboardData = {
                ...e,
                rank: index + 1,
            };
            return reRank;
        });
        setFilteredData(reRanked);
    };

    const onShowStats = () => {
        setSelectedSize(undefined);
        setShowStats(true);
    };

    return (
        <Layout>
            <CompetitionPageContainer>
                <Title>Hvaða skóli las mest?</Title>
                <About>
                    <p>
                        Sem fyrr gengur keppnin út á að lesa setningar hér inn á{' '}
                        <Link href={'/'} passHref>
                            <StyledLink>samrómur.is</StyledLink>
                        </Link>
                        . Upptökurnar munu svo mynda gagnasafn sem verður notað
                        til að þróa máltæknilausnir sem kenna tölvum og tækjum
                        að skilja íslensku. Forseti Íslands og forsetafrú munu
                        hefja keppnina og verðlaunaafhending að henni lokinni
                        fer fram á Bessastöðum.
                    </p>
                    <p>
                        Nemendur, foreldrar og starfsfólk skóla geta lesið inn
                        fyrir sinn skóla. Við hvetjum alla til að taka þátt því
                        miklu skiptir að fá framlög frá breiðum hópi og tryggja
                        þannig að tæknin skilji raddir og framburð allra.
                    </p>
                    <p>
                        Skólum er skipt í þrjá flokka líkt og í fyrra og
                        verðlaun veitt fyrir efsta sætið í hverjum flokki. Þar
                        að auki verða veitt þrenn verðlaun fyrir þá skóla sem
                        skara fram úr en eru ekki í fyrsta sæti í sínum flokki.
                    </p>
                    <p>
                        Verðlaunin verða vegleg í ár og hlökkum við til að segja
                        meira frá þeim á næstu dögum.
                    </p>
                    <p>
                        Í fyrstu keppni 2020 þá tóku 1430 manns þátt fyrir hönd
                        130 skóla og lásu í kringum 144 þúsund setningar. Alls
                        tóku um 6.000 manns þátt fyrir hönd 136 skóla og lásu
                        rúmlega 776 þúsund setningar í annarri Lestrarkeppni
                        grunnskóla 2021. Yfir 920.000 innlesnar setningar hafa
                        því safnast undanfarin tvö ár og erum við því afar
                        spennt fyrir þessari þriðju keppni og vonumst eftir
                        þátttöku sem flestra skóla.
                    </p>
                </About>
                {/* {(isCompetition() || isCompetitionOver()) && ( */}
                {false && (
                    <>
                        <SelectorContainer>
                            <SelectableH2
                                onClick={() =>
                                    onSelectorClick(CompanySizes.all)
                                }
                            >
                                Stigatafla
                            </SelectableH2>
                            <h2>{' / '}</h2>
                            <SelectableH2 onClick={() => onShowStats()}>
                                Línurit
                            </SelectableH2>
                        </SelectorContainer>
                        <SelectorButtons>
                            <SelectButton
                                onClick={() =>
                                    onSelectorClick(CompanySizes.all)
                                }
                                selected={selectedSize == CompanySizes.all}
                            >
                                Allir
                            </SelectButton>
                            <SelectButton
                                onClick={() =>
                                    onSelectorClick(CompanySizes.small)
                                }
                                selected={selectedSize == CompanySizes.small}
                            >
                                Litlir
                            </SelectButton>
                            <SelectButton
                                onClick={() =>
                                    onSelectorClick(CompanySizes.medium)
                                }
                                selected={selectedSize == CompanySizes.medium}
                            >
                                Miðlungs
                            </SelectButton>
                            <SelectButton
                                onClick={() =>
                                    onSelectorClick(CompanySizes.large)
                                }
                                selected={selectedSize == CompanySizes.large}
                            >
                                Stórir
                            </SelectButton>
                        </SelectorButtons>
                        <ScoreboardStatsContainer>
                            {!showStats && (
                                <Scoreboard blue data={filteredData} />
                            )}
                            {showStats && <CompetitionStats />}
                        </ScoreboardStatsContainer>
                    </>
                )}
                <BottomContent>
                    <Link href="/grunnskolakeppni" passHref>
                        <StyledLink>
                            Ertu að leita að Grunnskólakeppninni 2021?
                        </StyledLink>
                    </Link>
                    <br />
                    <Link href="/keppni" passHref>
                        <StyledLink>
                            Ertu að leita að Reddum málinu 2021?
                        </StyledLink>
                    </Link>
                </BottomContent>
            </CompetitionPageContainer>
        </Layout>
    );
};

export default Competition;
