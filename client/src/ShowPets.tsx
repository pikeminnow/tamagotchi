import React, { useEffect, useState } from "react";
import { checkCookie } from "./CheckCookie";
import { Link } from "react-router-dom";
import HatchPetForm from "./HatchPetForm";
import { Bar } from "@nivo/bar";


//TODO: remove this after serializing out the digest
type PetInfo = {
    id: number
    bio: string
    relationship?: number
    player: {
        id: number
        name: string
        password_digest: string
    }
    tama_character: {
        id: number
        name: string
        hunger: number
        attention: number
        sick: boolean
        weight: number
        height: number
    }

}

export default function ShowPets() {

    const [petName, setPetName] = useState("");
    const [myPets, setMyPets] = useState([] as PetInfo[]);
    const [selectedPet, setSelectedPet] = useState(0);


    useEffect(() => {


        fetch("/mypets")
            .then((response) => response.json())
            .then((petInfo) => setMyPets([petInfo]))
    }, [])

    // this is for later
    // useEffect(() => {
    //     if (myPets.length > 0) {
    //         console.log({ myPets })
    //         setSelectedPet((cur) => {
    //             let newSelectedPetData = Object.entries(myPets[0])[4]
    //             console.log({ newSelectedPetData })
    //             return { ...cur, newSelectedPetData }
    //         }
    //         )
    //     }
    // }, [myPets])

    if (checkCookie('user_id') === undefined) {
        return (
            <div>
                <Link to="/Auth"> Please Log In </Link>
            </div>
        )
    }
    else if (checkCookie('tama_character_id') === undefined) {
        return (<div>
            <p>u need to hatch a pet</p>
            <HatchPetForm
                petName={petName}
                setPetName={setPetName}
            />
        </div>
        )
    }
    else {
        //data={[{ label: 'selectedPet', hunger: 4 }, { label: 'myotherpet', hunger: 6 }]}
        const barChartData = myPets.length > 0 ? [
            { label: 'hunger', value: myPets[selectedPet].tama_character.hunger },
            { label: 'attention', value: myPets[selectedPet].tama_character.attention },
            { label: 'weight', value: myPets[selectedPet].tama_character.weight },
            { label: 'height', value: myPets[selectedPet].tama_character.height }
        ] : [];

        return (<div>
            <p>
                this is your pet stats
            </p>
            <Bar
                width={400}
                height={400}
                data={barChartData}
                indexBy='label'
                keys={['value']}
                minValue={0}
                maxValue={10}
                groupMode="grouped"
                layout="horizontal"
                colors={{ scheme: "pastel1" }}
                colorBy={"indexValue"}
                labelTextColor="#aaaaaa"
                theme={{ 'legends': { 'text': { 'fill': '#aaaaaa' } } }}
                legends={[
                    {
                        dataFrom: 'indexes',
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 100,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
                role="application"
                ariaLabel="Nivo bar chart demo"
                barAriaLabel={function (e) { return e.id + ": " + e.formattedValue + " in pet vital statistic: " + e.indexValue }}
            />
        </div>)
    }

}