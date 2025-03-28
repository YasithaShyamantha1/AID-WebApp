function LocationTab(props) {

    const handleClick = () => {
        props.onClick(props.name); // handleSelectLocation(props.name)
    }

    const isSelected = props.selectedLocation === props.name;

    return (
        <div
            onClick={handleClick}
            className={`text-base border rounded-md px-4 py-2 cursor-pointer transition-all duration-300 
                ${isSelected ? 'bg-black text-white' : 'bg-white text-gray-700'} 
                hover:bg-blue-100 hover:text-blue-500 hover:border-blue-500 relative`}
        >
            {props.name}
            {/* Add underline effect when hovered or selected */}
            <div
                className={`absolute bottom-0 left-0 w-full h-1 transition-all duration-300 bg-blue-500 transform scale-x-0 
                    ${isSelected ? 'scale-x-100' : ''} group-hover:scale-x-100`}
            ></div>
        </div>
    );
}

export default LocationTab;
